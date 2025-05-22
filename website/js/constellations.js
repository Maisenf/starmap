function drawConstellationHTML(constellations, container) {
    // Clear previous constellations
    const svgNS = "http://www.w3.org/2000/svg";
  
    // Erstelle ein SVG-Element als Zeichenfläche
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    container.appendChild(svg);
  
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
  
    constellations.forEach(constellation => {
      try {
        const lines = JSON.parse(constellation.lines);
        if (!lines || !lines.length) return;
  
        lines.forEach(line => {
          const points = [];
  
          line.forEach(hipNumber => {
            const star = starsByHip[hipNumber];
            if (!star) return;
  
            const { alt, az } = raDecToAltAz(star.RAICRS, star.DEICRS, settings.lat, settings.lon);
  
            if (alt > 0) {
              const r = (90 - alt) / 90;
              const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
              const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
              points.push({ x, y });
            }
          });
  
          if (points.length >= 2) {
            for (let i = 0; i < points.length - 1; i++) {
              const lineEl = document.createElementNS(svgNS, "line");
              lineEl.setAttribute("x1", points[i].x);
              lineEl.setAttribute("y1", points[i].y);
              lineEl.setAttribute("x2", points[i + 1].x);
              lineEl.setAttribute("y2", points[i + 1].y);
              lineEl.setAttribute("stroke", settings.lineColor);
              lineEl.setAttribute("stroke-width", 1 * settings.userScaleStars);
              lineEl.setAttribute("stroke-linecap", "round");
              svg.appendChild(lineEl);
            }
          }
        });
  
        // Constellation Name anzeigen
        const star = starsByHip[JSON.parse(constellation.lines)[0][0]];
        if (settings.showConstellationNames && star) {
          const { alt, az } = raDecToAltAz(star.RAICRS, star.DEICRS, settings.lat, settings.lon);
  
          if (alt > 0) {
            const r = (90 - alt) / 90;
            const x = centerX + (centerX * r) * Math.sin(az * Math.PI / 180);
            const y = centerY - (centerY * r) * Math.cos(az * Math.PI / 180);
  
            const label = document.createElement("a");
            label.className = "constellation-label";
            label.textContent = constellation.name;
            label.style.position = "absolute";
            label.style.left = `${x + 10}px`;
            label.style.top = `${y + 5}px`;
            label.style.color = "#8fa3ff";
            label.style.fontSize = `${settings.fontSize}`;
            label.style.fontFamily = `${settings.font}`;
            container.appendChild(label);
          }
        }
  
      } catch (e) {
        console.error(`Fehler beim Zeichnen von ${constellation.name}:`, e);
      }
    });
  }
  