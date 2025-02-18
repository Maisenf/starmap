const canvasStars = document.getElementById("containerStars");
const ctxStars = canvasStars.getContext("2d");

const canvasMessier = document.getElementById("containerMessier");
const ctxMessier = canvasMessier.getContext("2d");

const canvasBackground = document.getElementById("background");
const ctxBackground = canvasBackground.getContext("2d");

const redCo = [1.62098281e-82, -5.03110845e-77, 6.66758278e-72, -4.71441850e-67, 1.66429493e-62, -1.50701672e-59, -2.42533006e-53, 8.42586475e-49, 7.94816523e-45, -1.68655179e-39, 7.25404556e-35, -1.85559350e-30, 3.23793430e-26, -4.00670131e-22, 3.53445102e-18, -2.19200432e-14, 9.27939743e-11, -2.56131914e-07, 4.29917840e-04, -3.88866019e-01, 3.97307766e+02];
const greenCo = [1.21775217e-82, -3.79265302e-77, 5.04300808e-72, -3.57741292e-67, 1.26763387e-62, -1.28724846e-59, -1.84618419e-53, 6.43113038e-49, 6.05135293e-45, -1.28642374e-39, 5.52273817e-35, -1.40682723e-30, 2.43659251e-26, -2.97762151e-22, 2.57295370e-18, -1.54137817e-14, 6.14141996e-11, -1.50922703e-07, 1.90667190e-04, -1.23973583e-02, -1.33464366e+01];
const blueCo = [2.17374683e-82, -6.82574350e-77, 9.17262316e-72, -6.60390151e-67, 2.40324203e-62, -5.77694976e-59, -3.42234361e-53, 1.26662864e-48, 8.75794575e-45, -2.45089758e-39, 1.10698770e-34, -2.95752654e-30, 5.41656027e-26, -7.10396545e-22, 6.74083578e-18, -4.59335728e-14, 2.20051751e-10, -7.14068799e-07, 1.46622559e-03, -1.60740964e+00, 6.85200095e+02];

let scaleX, scaleY;

function getGeoLocation(name) {
  const country = countriesData.find(country => country.name === name || country.iso === name);
  if (country) {
    settings.lat = country.coordinate[1];
    settings.lon = country.coordinate[0];
  }
}

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
  canvasMessier.width = window.innerWidth;
  canvasMessier.height = window.innerHeight;
  scaleX = canvasStars.width / 2;
  scaleY = canvasStars.height / 2;
  resetCanvas();
  if (settings.showMessierObjects) {
    drawMessierObjects(messierData);
  }
  drawStars(jsonDataStars);
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

function resetCanvas() {
  ctxStars.clearRect(0, 0, canvasStars.width, canvasStars.height);
  ctxStars.fillStyle = "transparent";
  ctxStars.fillRect(0, 0, canvasStars.width, canvasStars.height);

  ctxMessier.clearRect(0, 0, canvasMessier.width, canvasMessier.height);
  ctxMessier.fillStyle = "transparent";
  ctxMessier.fillRect(0, 0, canvasMessier.width, canvasMessier.height);
}

function drawStars(stars) {

  const centerX = canvasStars.width / 2;
  const centerY = canvasStars.height / 2;

  stars.forEach(star => {
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

      ctxStars.beginPath();
      ctxStars.arc(x, y, brightness, 0, 2 * Math.PI);
      ctxStars.fillStyle = starColor;


      ctxStars.shadowColor = starColor;
      ctxStars.shadowBlur = brightness * 3;
      ctxStars.fill();
      ctxStars.shadowBlur = 0;


      if (brightestStars.get(star.HIP) && settings.showStarnames) {
        ctxStars.font = settings.fontSize + " " + settings.font;
        ctxStars.fillStyle = "#f0f0f0";
        ctxStars.fillText(`${brightestStars.get(star.HIP)}`, x, y + 20);
      }
    }
  });
}

function drawMessierObjects(messierObjects) {
  const centerX = canvasMessier.width / 2;
  const centerY = canvasMessier.height / 2;

  messierObjects.forEach(messier => {
    const { alt, az } = raDecToAltAz(messier.ra, messier.dec, settings.lat, settings.lon);

    if (alt > 0 && messier.image) {
      const r = (90 - alt) / 90;

      const x = centerX + (scaleX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (scaleY * r) * Math.cos(az * Math.PI / 180);

      const img = new Image();
      img.src = messier.image;

      img.onload = function () {
        ctxMessier.globalAlpha = 0.9;
        const imgSize = Math.max(7, 50 - messier.mag * 5) * settings.userScaleMessierObjects;
        ctxMessier.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
        ctxMessier.globalAlpha = 1;
        if (settings.showMessierNames) {
          ctxMessier.font = settings.fontSize + " " + settings.font;
          ctxMessier.fillStyle = "#f0f0f0";
          ctxMessier.fillText(messier.messier, x, y + imgSize / 2 + 10);
        }
      };
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
  resizeCanvas();
}


window.onload = function () {
  prepareBackground();
  resizeCanvas();
  window.requestAnimationFrame(run);
};

window.addEventListener("resize", resizeCanvas); //draw on browser resize (optional)
