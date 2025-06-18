function drawMessierObjectsHTML(messierObjects, container) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
  
    messierObjects.forEach((messier) => {
      const { alt, az } = raDecToAltAz(messier.RA, messier.Dec, settings.lat, settings.lon);
      if (alt <= 0 || !messier.Image) return;
  
      const r = (90 - alt) / 90;
      const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
  
      const imgSize = Math.max(4, 40 - messier.Magnitude * 5) * settings.userScaleMessierObjects;
  
      const imgEl = messierImages[messier.Image]?.cloneNode() || new Image();
      imgEl.src = messier.Image; 

      imgEl.className = "messier-object";
      imgEl.style.position = "absolute";
      imgEl.style.left = `${x - imgSize / 2}px`;
      imgEl.style.top = `${y - imgSize / 2}px`;
      imgEl.style.width = `${imgSize}px`;
      imgEl.style.height = `${imgSize}px`;
      imgEl.style.opacity = "0.9";
      imgEl.style.pointerEvents = "none";
      container.appendChild(imgEl);
      imgEl.onclick = function () {

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
        
        distance.textContent = `Entfernung: ${star.Plx ? (1000 / star.Plx * 3.26156).toFixed(1) + ' Lj' : 'unbekannt'}`;
        categorie.textContent = `HIP-Katalog-Nr.: ${star.HIP || 'n/a'}`;
        helligkeit.textContent = `Helligkeit (Vmag): ${star.Vmag?.toFixed(2) ?? 'n/a'}`;
        menu.style.left = `${parseFloat(starEl.style.left) + 30}px`;
        menu.style.top = `${parseFloat(starEl.style.top) - 10}px`;

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
    });
  }
  