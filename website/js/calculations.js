function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  
function lerpAngle(a, b, t) {
    let diff = b - a;
    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        diff -= 360;
      } else {
        diff += 360;
      }
    }
    return (a + diff * t + 360) % 360;
}
  
function interpolateOrbitalElements(planetArray, jd) {
    const sorted = [...planetArray].sort((a, b) => a.DatetimeJD - b.DatetimeJD);
    
    let i = 0;
    while (i < sorted.length && sorted[i].DatetimeJD < jd) i++;
    
    if (i === 0) return sorted[0];
    if (i === sorted.length) return sorted[sorted.length - 1];
    
    const [t0, t1] = [sorted[i-1].DatetimeJD, sorted[i].DatetimeJD];
    const factor = (jd - t0) / (t1 - t0);
    
    return interpolateValues(sorted[i-1], sorted[i], factor);
}
  
function raDecToAltAz(ra, dec, lat, lon) {
    const now = new Date();
    const jd = now.getTime() / 86400000.0 + 2440587.5;
    const gst = 18.697374558 + 24.06570982441908 * (jd - 2451545.0);
    const lst = (gst + lon / 15) % 24;
    const ha = (lst * 15 - ra + 360) % 360;
  
    const haRad = ha * Math.PI / 180;
    const decRad = dec * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
  
    const sinAlt = Math.sin(decRad) * Math.sin(latRad)
      + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
    const alt = Math.asin(sinAlt) * 180 / Math.PI;
  
    const cosAz = (Math.sin(decRad) - Math.sin(alt * Math.PI / 180) * Math.sin(latRad))
      / (Math.cos(alt * Math.PI / 180) * Math.cos(latRad));
    let az = Math.acos(cosAz) * 180 / Math.PI;
    if (Math.sin(haRad) < 0) az = 360 - az;
  
    return { alt, az };
}
  
function solveKepler(M, e, tol = 1e-6) {
    let E = M;
    let delta = 1;
    while (Math.abs(delta) > tol) {
      delta = E - e * Math.sin(E) - M;
      E = E - delta / (1 - e * Math.cos(E));
    }
    return E;
}
  
function keplerElementsToHelioCoords(planet, currentJD) {
    const deg2rad = Math.PI / 180;
    const dt = currentJD - planet.DatetimeJD;
    let M_deg = (planet.MeanAnomaly + planet.MeanMotion * dt) % 360;
    let M = M_deg * deg2rad;
    const e = planet.Eccentricity;
    const E = solveKepler(M, e);
    const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    const r = planet.SemiMajorAxis * (1 - e * Math.cos(E));
    const w = planet.ArgumentPeriapsis * deg2rad;
    const Omega = planet.LongitudeAscendingNode * deg2rad;
    const incl = planet.Inclination * deg2rad;
    const theta = nu + w;
    const X = r * (Math.cos(Omega) * Math.cos(theta) - Math.sin(Omega) * Math.sin(theta) * Math.cos(incl));
    const Y = r * (Math.sin(Omega) * Math.cos(theta) + Math.cos(Omega) * Math.sin(theta) * Math.cos(incl));
    const Z = r * (Math.sin(theta) * Math.sin(incl));
    return { X, Y, Z };
}
  
function helioToRA_Dec(Xg, Yg, Zg) {
    const deg2rad = Math.PI / 180;
    const epsilon = 23.43928 * deg2rad;
    const Xeq = Xg;
    const Yeq = Yg * Math.cos(epsilon) - Zg * Math.sin(epsilon);
    const Zeq = Yg * Math.sin(epsilon) + Zg * Math.cos(epsilon);
    let RA = Math.atan2(Yeq, Xeq);
    if (RA < 0) RA += 2 * Math.PI;
    const Dec = Math.asin(Zeq / Math.sqrt(Xeq ** 2 + Yeq ** 2 + Zeq ** 2));
    return { RA: RA * 180 / Math.PI, Dec: Dec * 180 / Math.PI };
}
  
function bvToTemp(ci) {
    return 4600 * (1 / (0.92 * ci + 1.7) + 1 / (0.92 * ci + 0.62));
}
  
function evaluatePolynomial(temp, coefficients) {
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
      const power = coefficients.length - 1 - i;
      result += coefficients[i] * Math.pow(temp, power);
    }
    return result;
}
  
function tempToRGB(temp) {
    let red = evaluatePolynomial(temp, redCo);
    let green = evaluatePolynomial(temp, greenCo);
    let blue = evaluatePolynomial(temp, blueCo);
  
    red = Math.min(255, Math.max(0, Math.round(red)));
    green = Math.min(255, Math.max(0, Math.round(green)));
    blue = Math.min(255, Math.max(0, Math.round(blue)));
  
    return `rgb(${red},${green},${blue})`;
}
  
function bvToRGB(ci) {
    const temp = bvToTemp(ci);
    return tempToRGB(temp);
}