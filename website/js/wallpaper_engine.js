
var wallpaperSettings = {
  fps: 0.1
};

var country = "Germany";
var starname = true;

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.country) {
      country = properties.country.value;
      const loc = getGeoLocation(country);
      lat = loc[1], lon = loc[0];
      resizeCanvas();
    }
    if (properties.lat) {
      lat = parseFloat(properties.lat.value);
      resizeCanvas();
    }
    if (properties.lon) {
      lon = parseFloat(properties.lon.value);
      resizeCanvas();
    }
    if (properties.starnames) {
      starname = properties.starnames.value;
      resizeCanvas();
    }
  },
};

