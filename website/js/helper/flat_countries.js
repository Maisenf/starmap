const fs = require('fs');
const data = require('./countries.json');
const countriesData = data.data
const newArray = countriesData.map(feature => ({
  name: feature.properties.ADMIN,
  iso: feature.properties.ISO_A3,
  coordinate: feature.geometry.coordinates[0][0][0]
}));
// Erzeuge den String, der in der Datei stehen soll:
// Hier wird das Array schön formatiert (Indentation = 2 Leerzeichen)
const fileContent = 'const countriesData = ' + JSON.stringify(newArray, null, 2) + ';';

// Schreibe den String in die neue Datei (z. B. neueDaten.js)
fs.writeFileSync('messier_flat.js', fileContent, 'utf8');

console.log('Die Datei neueDaten.js wurde erfolgreich erstellt!');

