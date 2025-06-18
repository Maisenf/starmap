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


  
      container.appendChild(starEl);
  
      if (star.Name && settings.showStarNames) {
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

  // Falls Menü nicht sichtbar, abbrechen
  if (menu.style.display !== "flex") return;

  // Prüfe, ob der Klick auf einen Stern oder das Menü selbst war
  const isStar = event.target.classList.contains("star");
  const isInsideMenu = menu.contains(event.target);

  if (!isStar && !isInsideMenu) {
    menu.style.display = "none";
  }
});
