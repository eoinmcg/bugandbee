import Game from "../core/game";
import Config from "../data/config";
import palette from "../data/palette";
let skySeed = 6;

const drawWeather = {
  stars: function () {
    const random = new RandomGenerator(skySeed);
    const wave = Math.abs(Math.sin(new Date().getTime() * 0.0005));

    for (let i = 100; i--;) {
      let size = random.float(6, 1);
      let speed = random.float() < .9 ? random.float(5) : random.float(99, 9);
      let color = palette.white.mk(random.float(0.7, 1));

      // Get world space dimensions
      const worldW = mainCanvasSize.x / cameraScale;
      const worldH = mainCanvasSize.y / cameraScale;
      const extraSpace = 200 / cameraScale;

      // Generate random position in world space
      const worldX = cameraPos.x - worldW / 2 - extraSpace + random.float(worldW + 2 * extraSpace);
      const worldY = cameraPos.y - worldH / 2 - extraSpace + random.float(worldH + 2 * extraSpace);
      const worldPos = vec2(worldX, worldY);

      // Convert size to world space
      const worldSize = size / cameraScale;

      // Set alpha based on wave
      color.a = wave + 0.5;

      // Draw star as a small rectangle
      drawRect(worldPos, vec2(worldSize, worldSize), color);
    }
  },
  snow: function () {
    const random = new RandomGenerator(skySeed);
    for (let i = 500; i--;) {
      let size = random.float(6, 1);
      // let speed = random.float() < .9 ? random.float(5) : random.float(99,9);
      let speed = random.float(99, 50);

      let color = (new Color).setHSLA(random.float(.2, -.3), random.float() ** 9, random.float(1, .5), random.float(.9, .3));

      const extraSpace = 200;
      const w = mainCanvas.width + 2 * extraSpace, h = mainCanvas.height + 2 * extraSpace;
      const screenPos = vec2(
        ((random.float(w) + time * (speed * -1)) % w + w) % w - extraSpace,
        (random.float(h) + time * speed * random.float()) % h - extraSpace);

      mainContext.beginPath();
      mainContext.fillStyle = palette.white.col;
      mainContext.arc(screenPos.x, screenPos.y, size, 0, 90);
      mainContext.fill();
    }

  },
  rain: function (speed) {
    let lateral = speed <= 0;
    const random = new RandomGenerator(skySeed);
    for (let i = 500; i--;) {
      const size = Math.round(random.float(2, 4)) / 10;
      let speedX = -150 * (size * 10),
        speedY = size * 2000;
      const extraSpace = 1000;
      const w = mainCanvas.width + 2 * extraSpace, h = mainCanvas.height + 2 * extraSpace;
      const screenPos = vec2(
        ((random.float(w) + time * speedX) % w + w) % w - extraSpace,
        (random.float(h) + time * speedY) % h - extraSpace);

      mainContext.lineWidth = size * 30;
      mainContext.strokeStyle = palette.pale_blue.mk(.2 + size);
      mainContext.beginPath();
      mainContext.moveTo(screenPos.x, screenPos.y);
      mainContext.lineTo(screenPos.x + (lateral ? -10 : 0), screenPos.y + 12);
      mainContext.stroke();

    }
  },
  fog: function () {
    const random = new RandomGenerator(skySeed + 1);
    const numLayers = 5;

    for (let layer = 0; layer < numLayers; layer++) {
      const speedX = 20 + layer * 10;
      const baseY = 200 + layer * 150;
      const opacity = 0.1 + layer * 0.05;

      // Draw multiple fog patches per layer
      for (let i = 0; i < 3; i++) {
        const extraSpace = 400;
        const w = mainCanvas.width + 2 * extraSpace;

        const x = ((random.float(w) + i * 400 + time * speedX) % w + w) % w - extraSpace;
        const y = baseY + Math.sin(time * 0.5 + i * 2) * 30; // Gentle vertical wave

        // Draw soft fog patch
        const gradient = mainContext.createRadialGradient(x, y, 0, x, y, 250);
        gradient.addColorStop(0, `rgba(200, 200, 220, ${opacity})`);
        gradient.addColorStop(1, 'rgba(200, 200, 220, 0)');

        mainContext.fillStyle = gradient;
        mainContext.fillRect(x - 250, y - 100, 500, 200);
      }
    }
  },
  fireflies: function () {
    const random = new RandomGenerator(skySeed + 2); // Different seed
    const numFireflies = 30;

    // Get actual camera viewport bounds in world space
    const worldWidth = mainCanvas.width / cameraScale;
    const worldHeight = mainCanvas.height / cameraScale;
    const worldMin = vec2(cameraPos.x - worldWidth / 2, cameraPos.y - worldHeight / 2);
    const worldMax = vec2(cameraPos.x + worldWidth / 2, cameraPos.y + worldHeight / 2);

    for (let i = 0; i < numFireflies; i++) {
      // Each firefly has its own movement pattern - directly in world space
      const baseX = worldMin.x + random.float(worldMax.x - worldMin.x);
      const baseY = worldMin.y + random.float(worldMax.y - worldMin.y);
      const speed = 20 + random.float(30);
      const phaseX = random.float(Math.PI * 2);
      const phaseY = random.float(Math.PI * 2);

      // Float around in figure-8 or circular patterns (scaled for world space)
      const worldPos = vec2(
        baseX + Math.sin(time * speed * 0.01 + phaseX) * 0.5,
        baseY + Math.cos(time * speed * 0.015 + phaseY) * 0.4
      );

      // Pulse effect: fade in and out
      const pulseSpeed = 2 + random.float(2);
      const opacity = (Math.sin(time * pulseSpeed + i) * 0.5 + 0.5) * 0.8;

      // Skip if faded out
      if (opacity < 0.1) continue;

      // Draw glowing firefly with multiple rects for glow effect
      const color = new Color(1, 0.9, 0.4, opacity);
      for (let r = 1; r <= 4; r++) {
        const glowColor = new Color(1, 0.9, 0.4, opacity * (1 - r / 4));
        drawRect(worldPos, vec2(r * 0.15), glowColor, time);
      }
    }
  },
  eyes: function () {
    // Initialize eyes state on first call
    if (!this.eyesState) {
      this.eyesState = {
        pairs: [],
        nextSpawn: time + 3 // First pair spawns in 3 seconds
      };
    }
    const state = this.eyesState;

    // Get actual camera viewport bounds in world space
    const worldWidth = mainCanvas.width / cameraScale;
    const worldHeight = mainCanvas.height / cameraScale;
    const worldMin = vec2(cameraPos.x - worldWidth / 2, cameraPos.y - worldHeight / 2);
    const worldMax = vec2(cameraPos.x + worldWidth / 2, cameraPos.y + worldHeight / 2);

    if (state.pairs.length < 1 && time >= state.nextSpawn) {
      const random = new RandomGenerator(skySeed + time);
      state.pairs.push({
        x: worldMax.x + 3, // Start off right edge in world space
        y: random.float(-7, -4),
        speedX: -2 - random.float(1.5), // Scaled speed for world space
        speedY: 0,
        nextBlink: time + 2 + random.float(4),
        blinkStart: 0,
        isBlinking: false,
        spawnTime: time
      });
      state.nextSpawn = time + 5 + Math.random() * 5; // Next spawn in 5-10 seconds
    }

    // Update and draw each pair
    for (let i = state.pairs.length - 1; i >= 0; i--) {
      const pair = state.pairs[i];

      // Move eyes
      pair.x += pair.speedX * 0.016;

      // Remove if off left edge
      if (pair.x < worldMin.x - 3) {
        state.pairs.splice(i, 1);
        continue;
      }

      // Check for blink
      if (!pair.isBlinking && time >= pair.nextBlink) {
        pair.isBlinking = true;
        pair.blinkStart = time;
      }

      // Calculate blink state
      let eyeHeightScale = 1;
      if (pair.isBlinking) {
        const blinkElapsed = time - pair.blinkStart;
        if (blinkElapsed < 0.15) {
          // Closing
          eyeHeightScale = 1 - blinkElapsed / 0.15;
        } else if (blinkElapsed < 0.3) {
          // Opening
          eyeHeightScale = (blinkElapsed - 0.15) / 0.15;
        } else {
          // Blink complete
          pair.isBlinking = false;
          pair.nextBlink = time + 2 + Math.random() * 4;
        }
      }

      // Draw both eyes with glow
      const eyeSpacing = 1.15; // World space units
      const eyePositions = [pair.x - eyeSpacing / 2, pair.x + eyeSpacing / 2];

      eyePositions.forEach(eyeX => {
        const eyePos = vec2(eyeX, pair.y);

        // Glow effect with multiple layers
        for (let r = 1; r <= 4; r++) {
          const glowColor = new Color(1, 0.2, 0.2, 0.6 * (1 - r / 4));
          // drawRect(eyePos, vec2(r * 0.5), glowColor);
          drawCircle(eyePos, r * 0.5, glowColor);
        }

        // Eye itself (using rect to approximate ellipse during blink)
        if (eyeHeightScale > 0.05) {
          const eyeWidth = 0.15; // ~6 pixels in world space
          const eyeHeight = 0.5 * eyeHeightScale; // ~12 pixels in world space
          const eyeColor = new Color(1, 0.4, 0.4, 0.9);
          drawCircle(eyePos, eyeHeight, eyeColor);
        }
      });
    }
  },
  lightning: function () {
    if (!this.lightningState) {
      this.lightningState = {
        nextStrike: time + 5 + Math.random() * 10, // First strike in 10-20 seconds
        flashStartTime: 0,
        isFlashing: false,
        flashDuration: 0.5
      };
    }

    const state = this.lightningState;

    if (!state.isFlashing && time >= state.nextStrike) {
      state.isFlashing = true;
      state.flashStartTime = time;
      state.nextStrike = time + 5 + Math.random() * 10;
    }

    // Draw the flash if active
    if (state.isFlashing) {
      const elapsed = time - state.flashStartTime;

      if (elapsed < state.flashDuration) {
        // Calculate fade: starts at 1 (white), fades to 0 (transparent)
        const alpha = 1 - (elapsed / state.flashDuration);

        drawRect(vec2(0), vec2(40), WHITE);
      } else {
        state.isFlashing = false; // Flash complete
      }
    }
  },
  clouds: function (darkCol = 'black') {
    const random = new RandomGenerator(skySeed);

    for (let i = 5; i--;) {
      let size = random.float(3, 1);
      let speed = random.float() < .9 ? random.float(5) : random.float(99, 9);
      speed *= size * -5;

      const extraSpace = 200;
      const w = mainCanvas.width + 2 * extraSpace, h = (mainCanvas.height / 4) + extraSpace;

      const screenPos = vec2(
        ((random.float(w) + time * speed) % w + w) % w - extraSpace,
        (random.float(h)));

      drawCloud(screenPos.x, screenPos.y, size);
    }

  },
  cloudsFast: function (masterSpeed) {
    masterSpeed === 0 ? 5 : masterSpeed;
    const random = new RandomGenerator(skySeed);
    for (let i = 5; i--;) {
      let size = random.float(3, 1);
      let speed = random.float() < .9 ? random.float(5) : random.float(99, 9);
      speed *= (size * - 25) * masterSpeed;

      const extraSpace = 800;
      const w = mainCanvas.width + 2 * extraSpace, h = (mainCanvas.height / 4) + extraSpace;

      const screenPos = vec2(
        ((random.float(w) + time * speed) % w + w) % w - extraSpace,
        (random.float(h)));

      drawCloud(screenPos.x, screenPos.y, size);
    }


  },
  tunnel: function (speed) {
    const random = new RandomGenerator(skySeed);
    for (let i = 500; i--;) {
      let speedX = -500,
        speedY = 0
      const extraSpace = 200;
      const w = mainCanvas.width + 2 * extraSpace, h = mainCanvas.height + 2 * extraSpace;
      const screenPos = vec2(
        ((random.float(w) + time * speedX) % w + w) % w - extraSpace,
        (random.float(h) + time * speedY) % h - extraSpace);

      // Convert screen pixels to world coordinates
      const worldStart = screenToWorld(screenPos);
      const worldEnd = screenToWorld(vec2(
        screenPos.x + 20,
        screenPos.y
      ));

      drawLine(
        worldStart,          // posA - start position
        worldEnd,            // posB - end position
        0.2,                 // width
        palette.pale_blue.mk(.5)
      );
    }
  },
  moon: function (darkCol) {
    mainContext.beginPath();
    mainContext.fillStyle = palette.white.mk(1);
    mainContext.arc(800, 120, 100, 0, 90);
    mainContext.fill();
    mainContext.beginPath();
    mainContext.fillStyle = darkCol;
    mainContext.arc(750, 90, 100, 0, 90);
    mainContext.fill();
  },
  sunset: function () {
    mainContext.beginPath();
    mainContext.fillStyle = palette.orange.mk(1);
    mainContext.arc(500, 650, 200, 0, 90);
    mainContext.fill();
  },
  moonrise: function () {

    const speedY = .1;
    const startY = -10;
    let moonY = (startY + time * speedY);
    if (moonY > 6) moonY = 6;

    drawCircle(vec2(0, moonY), 10, palette.white.mk(.8), 0, CLEAR_BLACK, true);
  },
}

function drawCloud(x, y, size, col = 'gray') {
  let raw = screenToWorld(vec2(x, y));
  let p = vec2(raw.x, raw.y);
  drawCircle(p.add(vec2(-size, 0)), size / 2, WHITE);
  drawCircle(p.add(vec2(size, 0)), size / 2, WHITE);
  drawRect(p, vec2(size * 2, size * .5), WHITE);
}

export default drawWeather;
