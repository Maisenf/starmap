var wallpaperSettings = {
  fps: 0.1
};

var country = "Germany";

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.country) {
      country = properties.country.value;
      const loc = getGeoLocation(country);
      lat = loc[1], lon = loc[0];
    }
    if (properties.lat) {
      lat = parseFloat(properties.lat.value);
    }
    if (properties.lon) {
      lon = parseFloat(properties.lon.value);
    }
  },
};

