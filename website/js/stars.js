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
  