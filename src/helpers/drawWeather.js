import Game from "../core/game";
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

      const extraSpace = 200;
      const w = mainCanvas.width + 2 * extraSpace, h = mainCanvas.height + 2 * extraSpace;
      const screenPos = vec2(
        (random.float(w)), (random.float(h)));

      color.a = wave + 0.5;
      mainContext.fillStyle = color;
      mainContext.fillRect(screenPos.x, screenPos.y, size, size);
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
      let speedX = lateral ? -250 : 0,
        speedY = 500
      const extraSpace = 200;
      const w = mainCanvas.width + 2 * extraSpace, h = mainCanvas.height + 2 * extraSpace;
      const screenPos = vec2(
        ((random.float(w) + time * speedX) % w + w) % w - extraSpace,
        (random.float(h) + time * speedY) % h - extraSpace);

      // Convert screen pixels to world coordinates
      const worldStart = screenToWorld(screenPos);
      const worldEnd = screenToWorld(vec2(
        screenPos.x + (lateral ? -10 : 0),
        screenPos.y + 12
      ));

      drawLine(
        worldStart,          // posA - start position
        worldEnd,            // posB - end position
        0.2,                 // width
        palette.pale_blue.mk(.5)
      );
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

    for (let i = 0; i < numFireflies; i++) {
      // Each firefly has its own movement pattern
      const baseX = random.float(mainCanvas.width);
      const baseY = random.float(mainCanvas.height);
      const speed = 20 + random.float(30);
      const phaseX = random.float(Math.PI * 2);
      const phaseY = random.float(Math.PI * 2);

      // Float around in figure-8 or circular patterns
      const x = baseX + Math.sin(time * speed * 0.01 + phaseX) * 50;
      const y = baseY + Math.cos(time * speed * 0.015 + phaseY) * 40;

      // Pulse effect: fade in and out
      const pulseSpeed = 2 + random.float(2);
      const opacity = (Math.sin(time * pulseSpeed + i) * 0.5 + 0.5) * 0.8;

      // Skip if faded out
      if (opacity < 0.1) continue;

      // Draw glowing firefly
      const glowSize = 15;
      const gradient = mainContext.createRadialGradient(x, y, 0, x, y, glowSize);
      gradient.addColorStop(0, `rgba(255, 255, 150, ${opacity})`);
      gradient.addColorStop(0.4, `rgba(255, 255, 100, ${opacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 200, 0, 0)');

      mainContext.fillStyle = gradient;
      mainContext.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);
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

    if (state.pairs.length < 1 && time >= state.nextSpawn) {
      const random = new RandomGenerator(skySeed + time);
      state.pairs.push({
        x: mainCanvas.width + 50,
        y: random.float(50) + 650,
        speedX: -30 - random.float(20),
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
      const elapsed = time - pair.spawnTime;

      // Move eyes
      pair.x += pair.speedX * 0.016;
      pair.y += pair.speedY * 0.016;

      // Remove if off left edge or too old
      if (pair.x < -50) {
        state.pairs.splice(i, 1);
        continue;
      }

      // Check for blink
      if (!pair.isBlinking && time >= pair.nextBlink) {
        pair.isBlinking = true;
        pair.blinkStart = time;
      }

      // Calculate blink state
      let eyeHeight = 12;
      if (pair.isBlinking) {
        const blinkElapsed = time - pair.blinkStart;
        if (blinkElapsed < 0.15) {
          // Closing
          eyeHeight = 12 * (1 - blinkElapsed / 0.15);
        } else if (blinkElapsed < 0.3) {
          // Opening
          eyeHeight = 12 * ((blinkElapsed - 0.15) / 0.15);
        } else {
          // Blink complete
          pair.isBlinking = false;
          pair.nextBlink = time + 2 + Math.random() * 4;
        }
      }

      // Draw both eyes with glow
      const eyeSpacing = 20;
      const eyePositions = [pair.x - eyeSpacing / 2, pair.x + eyeSpacing / 2];

      eyePositions.forEach(eyeX => {
        // Glow
        const gradient = mainContext.createRadialGradient(eyeX, pair.y, 0, eyeX, pair.y, 15);
        gradient.addColorStop(0, 'rgba(255, 50, 50, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        mainContext.fillStyle = gradient;
        mainContext.fillRect(eyeX - 15, pair.y - 15, 30, 30);

        // Eye itself (ellipse)
        if (eyeHeight > 0.5) {
          mainContext.beginPath();
          mainContext.ellipse(eyeX, pair.y, 6, eyeHeight / 2, 0, 0, Math.PI * 2);
          mainContext.fillStyle = 'rgba(255, 100, 100, 0.9)';
          mainContext.fill();
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

        mainContext.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
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

      const extraSpace = 200;
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
    const speedY = -5;
    const startY = 900;
    let moonY = (startY + time * speedY);

    if (moonY < 200) moonY = 200;

    mainContext.beginPath();
    mainContext.fillStyle = palette.white.mk(.8);
    mainContext.arc(500, moonY, 180, 0, Math.PI * 2); // Full circle
    mainContext.fill();
  },
}

function drawCloud(x, y, size, col = 'gray') {
  size *= 50;

  mainContext.fillStyle = palette[col].col;
  mainContext.globalAlpha = .5;
  mainContext.beginPath();
  mainContext.roundRect(x, y, size, size / 3, 20);
  mainContext.fill();


  mainContext.globalAlpha = 1;
}

export default drawWeather;
