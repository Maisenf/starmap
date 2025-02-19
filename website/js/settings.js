var settings = {
  fps: 0.1,
  lat: 52.52,
  lon: 13.40,
  font: "Arial",
  fontSize: "12px",
  showStarnames: true,
  userScaleStars: 1,
  showMessierObjects: true,
  showMessierNames: true,
  userScaleMessierObjects: 1,
};

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.country) {
      const loc = getGeoLocation(properties.country.value);
      if (loc) {
        settings.lat = loc[1], settings.lon = loc[0];
        resizeCanvas();
      }
    }
    if (properties.lat) {
      settings.lat = parseFloat(properties.lat.value);
      resizeCanvas();
    }
    if (properties.lon) {
      settings.lon = parseFloat(properties.lon.value);
      resizeCanvas();
    }
    if (properties.starnames) {
      settings.showStarnames = properties.starnames.value;
      resizeCanvas();
    }
    if (properties.font) {
      settings.font = properties.font.value;
      resizeCanvas();
    }
    if (properties.fontsize) {
      settings.fontSize = properties.fontsize.value;
      resizeCanvas();
    }
    if (properties.userscalestars) {
      settings.userScaleStars = properties.userscalestars.value;
      resizeCanvas();
    }
    if (properties.showmessierobjects) {
      settings.showMessierObjects = properties.showmessierobjects.value;
      resizeCanvas();
    }
    if (properties.showmessiernames) {
      settings.showMessierNames = properties.showmessiernames.value;
      resizeCanvas();
    }
    if (properties.userscalemessierobjects) {
      settings.userScaleMessierObjects = properties.userscalemessierobjects.value;
      resizeCanvas();
    }
  },
};