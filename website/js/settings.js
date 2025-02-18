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
      const loc = getGeoLocation(properties.country.valuetry);
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
      settings.showStarnames = properties.showStarnames.value;
      resizeCanvas();
    }
  },
};
