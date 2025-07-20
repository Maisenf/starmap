const mainContainer = document.getElementById("main-container");

async function draw() {
  mainContainer.innerHTML = "";
  
  drawStarsHTML(jsonDataStars, mainContainer);

  if(settings.showConstellationLines){
    drawConstellationHTML(constellationData, mainContainer);
  }
  
  if (settings.showMessierObjects) {
    drawMessierObjectsHTML(messierData, mainContainer);
  }
  
  if(settings.showPlanets){
    drawPlanetsHTML(jsonDataKeplerPlanets, mainContainer);
  }
}

var last = performance.now() / 1000;
var fpsThreshold = 0;

function run() {
  window.requestAnimationFrame(run);

  var now = performance.now() / 1000;
  var dt = Math.min(now - last, 1);
  last = now;

  if (settings.fps > 0.0) {
    fpsThreshold += dt;
    if (fpsThreshold < 1.0 / settings.fps) {
      return;
    }
    fpsThreshold -= 1.0 / settings.fps;
  }
  
  draw().catch(console.error);
}

window.onload = function () {
  initData(settings.starCount).then( () => {
    draw();
    run();
  });
};

window.onbeforeunload = () => {
  cancelAnimationFrame(animationFrameId);
  clearInterval(updateInterval);
  planetImages = null;
  starData = null;
  messierData = null;
  jsonDataStars= null; 
  jsonDataKeplerPlanets= null;
  constellationData=null;
  countryData=null;
  starsByHip = null;
  messierImages = null;
};
