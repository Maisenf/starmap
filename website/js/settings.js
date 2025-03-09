var settings = {
  fps: 0.1,
  lat: 52.52,
  lon: 13.40,   //Berlin 
  font: "Arial",
  fontSize: "12px",
  showStarNames: false,
  starCount: 5,
  userScaleStars: 1,
  showMessierObjects: true,
  showMessierNames: false,
  userScaleMessierObjects: 1,
  showConstellationLines: false,
  lineColor: "#408dd0",
  showConstellationNames: false,
  showPlanets: true,
  showPlanetsNames: false,
  userScalePlanets: 0.8
};

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.country) {
      initCountry(properties.country).then(result => {
        settings.lat = result.Latitude;
        settings.lon = result.Longitude;
        draw();
      });
    }
    if (properties.lat) {
      settings.lat = parseFloat(properties.lat.value);
      draw();
    }
    if (properties.lon) {
      settings.lon = parseFloat(properties.lon.value);
      draw();
    }
    if (properties.starnames) {
      settings.showStarNames = properties.starnames.value;
      draw();
    }
    if (properties.font) {
      settings.font = properties.font.value;
      draw();
    }
    if (properties.fontsize) {
      settings.fontSize = properties.fontsize.value;
      draw();
    }
    if (properties.userscalestars) {
      settings.userScaleStars = properties.userscalestars.value;
      draw();
    }
    if (properties.showmessierobjects) {
      settings.showMessierObjects = properties.showmessierobjects.value;
      draw();
    }
    if (properties.showmessiernames) {
      settings.showMessierNames = properties.showmessiernames.value;
      draw();
    }
    if (properties.userscalemessierobjects) {
      settings.userScaleMessierObjects = properties.userscalemessierobjects.value;
      draw();
    }
    if (properties.userScalePlanets) {
      settings.userScalePlanets = properties.userscaleplanets.value;
      draw();
    }
    if (properties.showplanets) {
      settings.showPlanets = properties.showplanets.value;
      draw();
    }
    if (properties.showplanetsnames) {
      settings.showPlanetsNames = properties.showplanetsnames.value;
      draw();
    }
    if (properties.userscaleplanets) {
      settings.userScalePlanets = properties.userscaleplanets.value;
      draw();
    }
    if (properties.showconstellationlines) {
      settings.showConstellationLines = properties.showconstellationlines.value;
      draw();
    }
    if (properties.showconstellationnames) {
      settings.showConstellationNames = properties.showconstellationnames.value;
      draw();
    }
    if (properties.starcount) {
      settings.starCount = properties.starcount.value;
      initData(settings.starCount).then(() => { draw(); });
    }
  },
};
