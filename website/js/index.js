const canvasStars = document.getElementById("containerStars");
const ctxStars = canvasStars.getContext("2d");

const canvasMessier = document.getElementById("containerMessier");
const ctxMessier = canvasMessier.getContext("2d");

const canvasBackground = document.getElementById("background");
const ctxBackground = canvasBackground.getContext("2d");

const offscreenCanvasStars = document.createElement("canvas");
const offscreenCtxStars = offscreenCanvasStars.getContext("2d");

const offscreenCanvasMessier = document.createElement("canvas");
const offscreenCtxMessier = offscreenCanvasMessier.getContext("2d");


const redCo = [1.62098281e-82, -5.03110845e-77, 6.66758278e-72, -4.71441850e-67, 1.66429493e-62, -1.50701672e-59, -2.42533006e-53, 8.42586475e-49, 7.94816523e-45, -1.68655179e-39, 7.25404556e-35, -1.85559350e-30, 3.23793430e-26, -4.00670131e-22, 3.53445102e-18, -2.19200432e-14, 9.27939743e-11, -2.56131914e-07, 4.29917840e-04, -3.88866019e-01, 3.97307766e+02];
const greenCo = [1.21775217e-82, -3.79265302e-77, 5.04300808e-72, -3.57741292e-67, 1.26763387e-62, -1.28724846e-59, -1.84618419e-53, 6.43113038e-49, 6.05135293e-45, -1.28642374e-39, 5.52273817e-35, -1.40682723e-30, 2.43659251e-26, -2.97762151e-22, 2.57295370e-18, -1.54137817e-14, 6.14141996e-11, -1.50922703e-07, 1.90667190e-04, -1.23973583e-02, -1.33464366e+01];
const blueCo = [2.17374683e-82, -6.82574350e-77, 9.17262316e-72, -6.60390151e-67, 2.40324203e-62, -5.77694976e-59, -3.42234361e-53, 1.26662864e-48, 8.75794575e-45, -2.45089758e-39, 1.10698770e-34, -2.95752654e-30, 5.41656027e-26, -7.10396545e-22, 6.74083578e-18, -4.59335728e-14, 2.20051751e-10, -7.14068799e-07, 1.46622559e-03, -1.60740964e+00, 6.85200095e+02];

let scaleX, scaleY;

var messierData, jsonDataStars, jsonDataKeplerPlanets, constellationData, countryData;

var starsByHip = {};



function prepareBackground() {
  ctxBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height);

  const gradient = ctxBackground.createRadialGradient(
    canvasBackground.width / 2,
    canvasBackground.height / 2,
    0,
    canvasBackground.width / 2,
    canvasBackground.height / 2,
    Math.max(canvasBackground.width, canvasBackground.height)
  );
  gradient.addColorStop(0, "#00000b");
  gradient.addColorStop(0.166, "#02000f");
  gradient.addColorStop(0.333, "#050113");
  gradient.addColorStop(0.5, "#080115");
  gradient.addColorStop(0.666, "#0c0118");
  gradient.addColorStop(0.833, "#0f0019");
  gradient.addColorStop(1, "#13001b");

  ctxBackground.filter = "blur(25px)";
  ctxBackground.fillStyle = gradient;
  ctxBackground.fillRect(0, 0, canvasBackground.width, canvasBackground.height);
}

function resizeCanvas() {
  canvasStars.width = window.innerWidth;
  canvasStars.height = window.innerHeight;
  canvasMessier.width = canvasStars.width;
  canvasMessier.height = canvasStars.height;

  offscreenCanvasStars.width = canvasStars.width;
  offscreenCanvasStars.height = canvasStars.height;
  offscreenCanvasMessier.width = canvasStars.width;
  offscreenCanvasMessier.height = canvasStars.height;

  scaleX = canvasStars.width / 2;
  scaleY = canvasStars.height / 2;
}

function resetCanvas() {
  offscreenCtxStars.clearRect(0, 0, canvasStars.width, canvasStars.height);
  offscreenCtxStars.fillStyle = "transparent";
  offscreenCtxStars.fillRect(0, 0, canvasStars.width, canvasStars.height);

  offscreenCtxMessier.clearRect(0, 0, canvasMessier.width, canvasMessier.height);
  offscreenCtxMessier.fillStyle = "transparent";
  offscreenCtxMessier.fillRect(0, 0, canvasMessier.width, canvasMessier.height);
}

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

function drawStars(stars, ctx) {

  const centerX = canvasStars.width / 2;
  const centerY = canvasStars.height / 2;

  stars.forEach(star => {
    if (star.RAICRS === null || star.DEICRS === null) return;
    const { alt, az } = raDecToAltAz(star.RAICRS, star.DEICRS, settings.lat, settings.lon);
    if (alt > 0) {
      const r = (90 - alt) / 90;

      const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);

      const brightness = Math.max(1, 6 - star.Vmag) * settings.userScaleStars;
      let starColor = "green";
      if (star.BV !== undefined) {
        starColor = bvToRGB(star.BV);
      }

      ctx.beginPath();
      ctx.arc(x, y, brightness, 0, 2 * Math.PI);
      ctx.fillStyle = starColor;


      ctx.shadowColor = starColor;
      ctx.shadowBlur = brightness * 3;
      ctx.fill();
      ctx.shadowBlur = 0;


      if (star.Name && settings.showStarNames) {
        ctx.font = settings.fontSize + " " + settings.font;
        ctx.fillStyle = "#f0f0f0";
        ctx.fillText(`${star.Name}`, x, y + 20);
      }
    }
  });
}

function drawMessierObjects(messierObjects, ctx) {
  return new Promise((resolve) => {
    const centerX = canvasMessier.width / 2;
    const centerY = canvasMessier.height / 2;
    let imagesLoaded = 0;
    let imagesToLoad = messierObjects.length;

    if (imagesToLoad === 0) {
      return resolve();
    }
    
    messierObjects.forEach(messier => {
      const { alt, az } = raDecToAltAz(messier.RA, messier.Dec, settings.lat, settings.lon);
      if (alt > 0 && messier.Image) {
        const r = (90 - alt) / 90;
        const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
        const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);

        const img = new Image();
        img.src = messier.Image;
        img.onload = function () {
          ctx.globalAlpha = 0.9;
          const imgSize = Math.max(4, 40 - messier.Magnitude * 5) * settings.userScaleMessierObjects;
          ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
          ctx.globalAlpha = 1;

          // M81 und M82 are close together, therefore dont show M82
          if (settings.showMessierNames && messier.Messier !== "M82") {
            ctx.font = settings.fontSize + " " + settings.font;
            ctx.fillStyle = "#f0f0f0";
            ctx.fillText(messier.Messier, x, y + imgSize / 2 + 10);
          }

          imagesLoaded++;
          if (imagesLoaded === imagesToLoad) {
            resolve();
          }
        };
      } else {
        imagesLoaded++;
      }
    });
  });
}

function drawPlanets(planetData, ctx) {
  const now = new Date();
  const currentJD = now.getTime() / 86400000.0 + 2440587.5;
  const centerX = canvasStars.width / 2;
  const centerY = canvasStars.height / 2;

  const planets = [];
  let earthHelio = null;

  planetData.forEach(planetArray => {
    const elements = interpolateOrbitalElements(planetArray, currentJD);
    if (!elements) return;

    const posHelio = keplerElementsToHelioCoords(elements, currentJD);
    
    if (elements.TargetName.includes("Earth")) {
      earthHelio = posHelio;
    }
    
    planets.push({
      name: elements.TargetName,
      magnitude: elements.VisualMagnitude,
      helioPos: posHelio,
      elements
    });
  });

  if (!earthHelio) {
    console.error("Erdposition nicht gefunden!");
    return;
  }

  planets.forEach(planet => {
    if (planet.name.includes("Earth")) return;

    const Xg = planet.helioPos.X - earthHelio.X;
    const Yg = planet.helioPos.Y - earthHelio.Y;
    const Zg = planet.helioPos.Z - earthHelio.Z;

    const pos = helioToRA_Dec(Xg, Yg, Zg);
    
    const { alt, az } = raDecToAltAz(
      pos.RA, 
      pos.Dec, 
      settings.lat, 
      settings.lon
    );

    if (alt > 0) {
      const r = (90 - alt) / 90;
      const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);

      const brightness = Math.max(1, 6 - planet.magnitude) * settings.userScalePlanets;

      ctx.beginPath();
      ctx.arc(x, y, brightness, 0, 2 * Math.PI);
      ctx.fillStyle = "#2eff02";
      ctx.fill();

      if(settings.showPlanetsNames){
        ctx.font = `${settings.fontSize}px ${settings.font}`;
        ctx.fillStyle = "#f0f0f0";
        ctx.fillText(planet.name.split(" (")[0], x + 10, y + 10); 
      }
    }
  });
}

function drawConstellation(constellations, ctx) {
  const centerX = canvasStars.width / 2;
  const centerY = canvasStars.height / 2;

  constellations.forEach(constellation => {
    try {
      const lines = JSON.parse(constellation.lines);
      if (!lines || !lines.length) return;

      lines.forEach(line => {
        const points = [];

        line.forEach(hipNumber => {
          const star = starsByHip[hipNumber];
          if (!star) return;
          
          const { alt, az } = raDecToAltAz(star.RAICRS, star.DEICRS, settings.lat, settings.lon);
          
          if (alt > 0) {
            const r = (90 - alt) / 90;
            const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
            const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);
            points.push({ x, y });
          }
        });

        if (points.length && settings.showConstellationLines) {
          ctx.beginPath();
          points.forEach((p, i) => {
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          });
          ctx.strokeStyle = settings.lineColor;
          ctx.lineWidth = 1 * settings.userScaleStars;
          ctx.shadowColor = settings.lineColor;
          ctx.shadowBlur = 15 * settings.userScaleStars;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

      const star = starsByHip[JSON.parse(constellation.lines)[0][0]];
      if (settings.showConstellationNames && star) {
        const { alt, az } = raDecToAltAz(
          star.RAICRS,
          star.DEICRS,
          settings.lat,
          settings.lon
        );
        
        if (alt > 0) {
          const r = (90 - alt) / 90;
          const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
          const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);
          
          ctx.fillStyle = "#8fa3ff";
          ctx.font = `${settings.fontSize}px ${settings.font}`;
          ctx.fillText(constellation.name, x + 10, y + 5);
        }
      }
    } catch (e) {
      console.error(`Fehler beim Zeichnen von ${constellation.name}:`, e);
    }
  });
}



var last = performance.now() / 1000;
var fpsThreshold = 0;

function run() {
  // Keep animating
  window.requestAnimationFrame(run);


  // Figure out how much time has passed since the last animation
  var now = performance.now() / 1000;
  var dt = Math.min(now - last, 1);
  last = now;

  // If there is an FPS limit, abort updating the animation if we have reached the desired FPS
  if (settings.fps > 0.0) {
    fpsThreshold += dt;
    if (fpsThreshold < 1.0 / settings.fps) {
      return;
    }
    fpsThreshold -= 1.0 / settings.fps;
  }
  draw();
}

function draw() {
  resizeCanvas();
  
  if (settings.showMessierObjects) {
    drawMessierObjects(messierDataFlat, offscreenCtxMessier).then( () => {
      ctxMessier.clearRect(0, 0, canvasMessier.width, canvasMessier.height);
      ctxMessier.drawImage(offscreenCanvasMessier, 0, 0);
    });
  }

  drawPlanets(jsonDataKeplerPlanets, offscreenCtxStars);
  drawStars(jsonDataStars, offscreenCtxStars);
  drawConstellation(constellationData, offscreenCtxStars);
  ctxStars.clearRect(0, 0, canvasStars.width, canvasStars.height);
  ctxStars.drawImage(offscreenCanvasStars, 0, 0);
  resetCanvas();
}


async function initCountry(country) {
  const mydb = await initDatabase();
  const result = await getCountry(mydb, country);
  if (result === undefined){
    return null;
  }
  return result;
}


async function initData(magnitude) {
  starsByHip = {};
  const mydb = await initDatabase();
  jsonDataStars = await getStars(mydb, magnitude);
  jsonDataStars.forEach(star => {
    starsByHip[star.HIP] = star;
  });
  messierDataFlat = await getMessierObjects(mydb);
  jsonDataKeplerPlanets = await getPlanets(mydb);
  constellationData = await getConstellations(mydb);
}


window.onload = function () {
  prepareBackground();
  initData(settings.starCount).then( () => {draw();});
  window.requestAnimationFrame(run);
};

window.addEventListener("resize", draw); //draw on browser resize (optional)