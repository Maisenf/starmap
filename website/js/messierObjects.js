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
    });
  }
  