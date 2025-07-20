function drawMessierObjectsHTML(messierObjects, container) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
  
    messierObjects.forEach((messier) => {
      const { alt, az } = raDecToAltAz(messier.RA, messier.Dec, settings.lat, settings.lon);
      if (alt <= 0 || !messier.Image) return;
  
      const r = (90 - alt) / 90;
      const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
      const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
  
      const imgSize = Math.max(5, 40 - messier.Magnitude * 5) * settings.userScaleMessierObjects;
  
      const imgEl = messierImages[messier.Image]?.cloneNode() || new Image();
      imgEl.src = messier.Image; 

      imgEl.className = "messier-object";
      imgEl.style.position = "absolute";
      imgEl.style.left = `${x - imgSize / 2}px`;
      imgEl.style.top = `${y - imgSize / 2}px`;
      imgEl.style.width = `${imgSize}px`;
      imgEl.style.height = `${imgSize}px`;
      imgEl.style.opacity = "0.9";
      imgEl.style.pointerEvents = "auto";
      container.appendChild(imgEl);
      imgEl.onclick = function (event) {
        event.stopPropagation(); // verhindert, dass das globale document.click es sofort wieder schließt

        const menu = document.getElementById("menu");
        const name = document.getElementById("name");
        const distance = document.getElementById("distance");
        const categorie = document.getElementById("categorie");
        const helligkeit = document.getElementById("helligkeit");

        menu.style.fontFamily = settings.font;
        menu.style.fontSize = settings.fontSize;
        menu.style.color = settings.lineColor;

        menu.style.display = "flex";

        name.textContent = `Name: ${messier.EnglishName || messier.Messier}`;
        if ((messier.Distance/1000000) < 1){
          distance.textContent = `Distance: ${ (messier.Distance) + ' Lj' || 'unbekannt'}`;
        }else{
          distance.textContent = `Distance: ${ (messier.Distance/1000000) + ' Mil Lj' || 'unbekannt'}`;
        }
        categorie.textContent = `Messier-Nr.: ${messier.Messier || 'n/a'}`;
        helligkeit.textContent = `Magnitude: ${messier.Magnitude?.toFixed(2) ?? 'n/a'}`;

        checkMenüBounderies(x, y);

        const starPreview = document.getElementById("starPreview");
        starPreview.innerHTML = '';

        const previewStar = document.createElement("div");
        const previewImage = document.createElement("img");

        if (messier.Image) {
          previewImage.src = messier.Image;
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
    });
  }
  