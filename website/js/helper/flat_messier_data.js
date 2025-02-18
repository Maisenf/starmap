const fs = require('fs');

const data = require('./catalogue-de-messier.json');

function hmsToDegrees(hms) {
  if (!hms) return null;
  const [h, m, s] = hms.split(':').map(Number);
  return (h + m / 60 + s / 3600) * 15;
}

function dmsToDegrees(dms) {
  if (!dms) return null;
  const parts = dms.match(/(-?\d+):(\d+):([\d.]+)/);
  if (!parts) return null; let [_, d, m, s] = parts.map(Number);
  const sign = d < 0 ? -1 : 1;
  return sign * (Math.abs(d) + m / 60 + s / 3600);
}

// provided Images
const messierImages = [
  { messier: "M1", image: "M1.webp" },
  { messier: "M16", image: "M16.webp" },
  { messier: "M31", image: "M31.webp" },
  { messier: "M42", image: "M42.webp" },
  { messier: "M51", image: "M51.webp" },
  { messier: "M57", image: "M57.webp" },
  { messier: "M63", image: "M63.webp" },
  { messier: "M64", image: "M64.webp" },
  { messier: "M77", image: "M77.webp" },
  { messier: "M81", image: "M81.webp" },
  { messier: "M82", image: "M82.webp" },
  { messier: "M83", image: "M83.webp" },
  { messier: "M91", image: "M91.webp" },
  { messier: "M94", image: "M94.webp" },
  { messier: "M96", image: "M96.webp" },
  { messier: "M101", image: "M101.webp" },
  { messier: "M102", image: "M102.webp" },
  { messier: "M104", image: "M104.webp" }
];

const messierArray = data
  .map(obj => {
    const imageEntry = messierImages.find(img => img.messier === obj.messier);
    return {
      messier: obj.messier,
      english_name: obj.english_name_nom_en_anglais,
      ra: hmsToDegrees(obj.ra),  // Umwandlung nach Dezimalgrad
      dec: dmsToDegrees(obj.dec),
      mag: obj.mag,
      ...(imageEntry ? { image: "./img/" + imageEntry.image } : {}) // Füge Bild nur hinzu, wenn es existiert
    };
  })
  .sort((a, b) => {
    const numA = parseInt(a.messier.replace("M", ""), 10);
    const numB = parseInt(b.messier.replace("M", ""), 10);
    return numA - numB;
  });
const fileContent = 'const messierData = ' + JSON.stringify(messierArray, null, 2) + ';';

fs.writeFileSync('messierData.js', fileContent, 'utf8');

console.log('Die Datei messierData.js wurde erfolgreich erstellt!');

