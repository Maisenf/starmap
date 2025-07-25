function drawPlanetsHTML(planetData, container) {
    const now = new Date();
    const currentJD = now.getTime() / 86400000.0 + 2440587.5;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
  
    const planets = [];
    let earthHelio = null;
  
    planetData.forEach(planetArray => {
      const elements = interpolateOrbitalElements(planetArray, currentJD);
      if (!elements) return;
  
      const posHelio = keplerElementsToHelioCoords(elements, currentJD);
  
      if (elements.TargetName.includes("Earth")) {
        earthHelio = posHelio;
      }
  
      planets.push({
        name: elements.TargetName,
        magnitude: elements.VisualMagnitude,
        helioPos: posHelio,
        elements
      });
    });
  
    if (!earthHelio) {
      console.error("Erdposition nicht gefunden!");
      return;
    }
  
    planets.forEach(planet => {
      if (planet.name.includes("Earth")) return;
      if (planet.name.includes("Mercury")) return;
  
      const Xg = planet.helioPos.X - earthHelio.X;
      const Yg = planet.helioPos.Y - earthHelio.Y;
      const Zg = planet.helioPos.Z - earthHelio.Z;
  
      const pos = helioToRA_Dec(Xg, Yg, Zg);
  
      const { alt, az } = raDecToAltAz(
        pos.RA,
        pos.Dec,
        settings.lat,
        settings.lon
      );
  
      if (alt <= 0) return;
  
      const r = (90 - alt) / 90;
      const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
  
      const name = planet.name.split(" ")[0];
      const img = planetImages[name];
      if (!img || !img.complete) return;
  
      const imgSize = Math.max(2, 20 - planet.magnitude * 2) * settings.userScalePlanets;
  
      const imgEl = img.cloneNode();
      imgEl.src = img.src;
      imgEl.alt = name;
      imgEl.className = "planet";
      imgEl.style.position = "absolute";
      imgEl.style.left = `${x - imgSize / 2}px`;
      imgEl.style.top = `${y - imgSize / 2}px`;
      imgEl.style.width = `${imgSize}px`;
      imgEl.style.height = `${imgSize}px`;
      imgEl.style.opacity = "0.8";
      imgEl.style.pointerEvents = "auto";
      container.appendChild(imgEl);

      imgEl.onclick = function (event) {
        event.stopPropagation();

        const menu = document.getElementById("menu");
        const name = document.getElementById("name");
        const distance = document.getElementById("distance");
        const categorie = document.getElementById("categorie");
        const helligkeit = document.getElementById("helligkeit");

        menu.style.fontFamily = settings.font;
        menu.style.fontSize = settings.fontSize;
        menu.style.color = settings.lineColor;

        menu.style.display = "flex";

        name.textContent = `Name: ${planet.name.split(" ")[0]}`;
        distance.textContent = `Magnitude: ${planet.magnitude}`;
        categorie.textContent = "";
        helligkeit.textContent ="";

        checkMenüBounderies(x,y);

        const starPreview = document.getElementById("starPreview");
        starPreview.innerHTML = '';

        const previewStar = document.createElement("div");
        const previewImage = document.createElement("img");

        const planetImage = "img/planets/" + planet.name.split(" ")[0] + ".webp";
        if (planetImage) {
          previewImage.src = planetImage;
          previewImage.style.display = "block";
          previewImage.style.width = `100px`;
          previewImage.style.height = "auto";
          previewImage.style.objectFit = "contain";
          previewImage.style.display = "block";
        } else {
          previewImage.style.display = "none"; 
        }

        previewStar.appendChild(previewImage);

        starPreview.appendChild(previewStar);
      };
  
      if (settings.showPlanetsNames) {
        const label = document.createElement("div");
        label.className = "planet-label";
        label.textContent = name;
        label.style.position = "absolute";
        label.style.left = `${x}px`;
        label.style.top = `${y + imgSize / 2 + 5}px`;
        label.style.color = "#f0f0f0";
        label.style.fontSize = `${settings.fontSize}px`;
        label.style.fontFamily = settings.font;
        label.style.transform = "translateX(-50%)";
        label.style.whiteSpace = "nowrap";
        label.style.textAlign = "center";
        label.style.pointerEvents = "none";
        container.appendChild(label);
      }
    });
}
  
function checkMenüBounderies(x,y){

  let left = x + 30;
  let top = y - 10;

  menu.style.visibility = "hidden";
  menu.style.display = "flex";

  const menuRect = menu.getBoundingClientRect();
  const menuWidth = menuRect.width;
  const menuHeight = menuRect.height;

  menu.style.visibility = "visible";

  if (left + menuWidth > window.innerWidth) {
    left = window.innerWidth - menuWidth - 10;
  }
  if (top + menuHeight > window.innerHeight) {
    top = window.innerHeight - menuHeight - 10;
  }
  if (left < 0) left = 10;
  if (top < 0) top = 10;

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;

}