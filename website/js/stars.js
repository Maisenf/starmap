brightest_stars = {
    32349: "Sirius",
    30438: "Canopus",
    71683: "Rigil Kentaurus",
    69673: "Arcturus",
    91262: "Vega",
    24608: "Capella",
    24436: "Rigel",
    37279: "Procyon",
    7588: "Achernar",
    27989: "Betelgeuse",
    68702: "Hadar",
    97649: "Altair",
    60718: "Acrux",
    21421: "Aldebaran",
    65474: "Spica",
    80763: "Antares",
    37826: "Pollux",
    113368: "Fomalhaut",
    62434: "Mimosa",
    102098: "Deneb",
    49669: "Regulus",
    33579: "Adhara",
    61084: "Gacrux",
    85927: "Shaula",
    25336: "Bellatrix",
    25428: "Elnath",
    45238: "Miaplacidus",
    31681: "Alhena",
    39953: "Kaus Australis",
    41037: "Avior",
    42913: "Alsephina",
    46390: "Alphard",
    54061: "Dubhe",
    62956: "Alioth",
    67301: "Alkaid",
    100751: "Peacock",
    109268: "Alnair",
    11767: "Polaris",
    15863: "Mirphak",
    28360: "Menkalinan",
    34444: "Wezen",
    82273: "Atria",
    86228: "Sargas",
    17702: "Pleiades",
    36850: "Castor",
    27366: "Saiph",
    746: "Caph",
    677: "Alpheratz",
    113881: "Scheat",
    113963: "Markab",
    14576: "Algol",
    9884: "Hamal",
    14135: "Menkar",
    5447: "Mirach",
    9640: "Almaak",
    117221: "Alfirk",
    1067: "Algenib",
    2081: "Ankaa",
    3419: "Diphda",
    95947: "Albireo",
    107315: "Enif",
    76267: "Alphekka",
    98036: "Alshain",
    72607: "Kochab",
    77070: "Unukalhai",
    68756: "Thuban",
    87833: "Etamin",
    112122: "Sadr",
    112029: "Gienah",
    102488: "Ruchbah",
    65378: "Mizar",
    58001: "Phecda",
}

function drawStarsHTML(stars, container) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
  
    stars.forEach(star => {
      if (star.RAICRS === null || star.DEICRS === null) return;
  
      const { alt, az } = raDecToAltAz(star.RAICRS, star.DEICRS, settings.lat, settings.lon);
      if (alt <= 0) return;
  
      const r = (90 - alt) / 90;
      const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
  
      const brightness = Math.max(1, 6 - star.Vmag) * settings.userScaleStars * 1.5;
      let starColor = "green";
      if (star.BV !== undefined) {
        starColor = bvToRGB(star.BV);
      }
  
      const starEl = document.createElement("div");
      starEl.className = "star";
      starEl.style.position = "absolute";
      starEl.style.left = `${x-(brightness/2)}px`;
      starEl.style.top = `${y-(brightness/2)}px`;
      starEl.style.width = `${brightness}px`;
      starEl.style.height = `${brightness}px`;
      starEl.style.borderRadius = "50%";
      starEl.style.background = starColor;
      starEl.style.boxShadow = `0 0 ${brightness * 3}px ${starColor}`;
      starEl.onclick = function () {

        const menu = document.getElementById("menu");
        const name = document.getElementById("name");
        const size = document.getElementById("size");
        const distance = document.getElementById("distance");
        const categorie = document.getElementById("categorie");
        const helligkeit = document.getElementById("helligkeit");

        menu.style.fontFamily = settings.font
        menu.style.fontSize = settings.fontSize
        menu.style.color = settings.lineColor

        
        menu.style.display = "flex";

        
        name.textContent = `Name: ${star.Name || 'Unbenannt'}`;
        
        distance.textContent = `Distance: ${star.Plx ? (1000 / star.Plx * 3.26156).toFixed(1) + ' Lj' : 'unbekannt'}`;
        categorie.textContent = `HIP-Katalog-Nr.: ${star.HIP || 'n/a'}`;
        helligkeit.textContent = `Magnitude: ${star.Vmag?.toFixed(2) ?? 'n/a'}`;

        checkMenüBounderies(parseFloat(starEl.style.left), parseFloat(starEl.style.top));

        const starPreview = document.getElementById("starPreview");
        starPreview.innerHTML = ''; 

        const previewStar = document.createElement("div");
        previewStar.style.width = `${brightness * 2}px`;
        previewStar.style.height = `${brightness * 2}px`;
        previewStar.style.borderRadius = "50%";
        previewStar.style.background = starColor;
        previewStar.style.boxShadow = `0 0 ${brightness * 3}px ${starColor}`;
        previewStar.style.margin = "10px auto";
        previewStar.style.position = "relative";

        starPreview.appendChild(previewStar);

      };
  
      container.appendChild(starEl);

      const starNames = Object.values(brightest_stars);
  
      if (settings.showStarNames && starNames.includes(star.Name)) {
        const label = document.createElement("div");
        label.className = "star-label";
        label.textContent = star.Name;
        label.style.position = "absolute";
        label.style.left = `${x + 5}px`;
        label.style.top = `${y + 10}px`;
        label.style.color = "#f0f0f0";
        label.style.fontFamily = `${settings.font}`;
        label.style.fontSize = `${settings.fontSize}`;
        container.appendChild(label);
      }
    });
  }

document.addEventListener("click", function (event) {
  const menu = document.getElementById("menu");

  if (menu.style.display !== "flex") return;

  const isStar = event.target.classList.contains("star");
  const isMessier = event.target.classList.contains("messier-object");
  const isInsideMenu = menu.contains(event.target);

  if (!isStar && !isMessier && !isInsideMenu) {
    menu.style.display = "none";
  }

});
