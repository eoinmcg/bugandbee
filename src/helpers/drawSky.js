import palette from "../data/palette";
import drawWeather from "./drawWeather";

let skySeed = 6;

export default function drawSky(style = 'dawn', extras = [], speed = 0) {


  if (style) {
    // let { cols, steps } = styles[style];
    // drawCopperGradient(cols, { steps });
    drawSimpleGradient(style);
  }

  extras.forEach((extra) => {
    drawWeather[extra](speed);
  })

}

const styles = {
  dawn: {
    light: 'flesh',
    med: 'pink',
    dark: 'red',
    streak: 10,
    stops: [1.8, 3]
  },
  dusk: {
    light: 'flame_orange',
    med: 'red',
    dark: 'maroon',
    streak: 10,
    stops: [1.8, 3]
  },
  day: {
    light: 'blue',
    med: 'navy_blue',
    dark: 'midnight_blue',
    streak: 20,
    stops: [1.8, 3]
  },
  night: {
    light: 'midnight_blue',
    med: 'slate',
    dark: 'midnight_blue',
    streak: 10,
    stops: [1.3, 3]
  },
  stormy: {
    light: 'midnight_blue',
    med: 'royal_purple',
    dark: 'midnight_blue',
    streak: 10,
    stops: [1.8, 3]
  },
  title: {
    light: 'navy_blue',
    med: 'royal_purple',
    dark: 'midnight_blue',
    streak: 10,
    stops: [1.8, 3]
  },
}

// const styles = {
//   dawn: {
//     cols: ['flesh', 'pink', 'red'],
//     steps: 20,
//   },
//   dusk: {
//     cols: ['flame_orange', 'red', 'maroon'],
//     steps: 20,
//   },
//   day: {
//     cols: ['blue', 'navy_blue', 'midnight_blue'],
//     steps: 20,
//   },
//   night: {
//     cols: ['midnight_blue', 'slate', 'midnight_blue'],
//     steps: 20,
//   },
//   stormy: {
//     cols: ['midnight_blue', 'royal_purple', 'midnight_blue'],
//     steps: 20,
//   },
//   title: {
//     cols: ['navy_blue', 'royal_purple', 'midnight_blue'],
//     steps: 20,
//   },
// }
//
// for (let style in styles) {
//   styles[style].cols.forEach((k, v) => {
//     styles[style].cols[v] = palette[k].col;
//   })
// }


function drawSimpleGradient(style = 'dawn') {
  // Get world space bounds from camera
  const worldWidth = mainCanvas.width / cameraScale;
  const worldHeight = mainCanvas.height / cameraScale;
  const worldMin = vec2(cameraPos.x - worldWidth / 2, cameraPos.y - worldHeight / 2);
  const worldMax = vec2(cameraPos.x + worldWidth / 2, cameraPos.y + worldHeight / 2);

  let { light, med, dark, streak, stops } = styles[style];

  const lightColor = palette[light].col;
  const medColor = palette[med].col;
  const darkColor = palette[dark].col;

  // Convert streak from pixels to world units
  // const streakWorld = streak / cameraScale;
  const streakWorld = .25;

  // Full sky background (light)
  const skyCenter = vec2(cameraPos.x, cameraPos.y);
  const skySize = vec2(worldWidth, worldHeight);
  drawRect(skyCenter, skySize, lightColor);

  // Medium layer (top portion)
  const medHeight = worldHeight / stops[0];
  const medCenter = vec2(cameraPos.x, worldMax.y - medHeight / 2);
  const medSize = vec2(worldWidth, medHeight);
  drawRect(medCenter, medSize, medColor);

  // Dark layer (top portion)
  const darkHeight = worldHeight / stops[1];
  const darkCenter = vec2(cameraPos.x, worldMax.y - darkHeight / 2);
  const darkSize = vec2(worldWidth, darkHeight);
  drawRect(darkCenter, darkSize, darkColor);

  // Light streak
  const lightStreakY = worldMax.y - worldHeight / stops[0] + streakWorld;
  const lightStreakCenter = vec2(cameraPos.x, lightStreakY);
  const lightStreakSize = vec2(worldWidth, streakWorld);
  drawRect(lightStreakCenter, lightStreakSize, lightColor);

  // Medium streak
  const medStreakY = worldMax.y - worldHeight / stops[1] + streakWorld;
  const medStreakCenter = vec2(cameraPos.x, medStreakY);
  const medStreakSize = vec2(worldWidth, streakWorld);
  drawRect(medStreakCenter, medStreakSize, medColor);
}

// Helper: Amiga-style copper gradient (multiple color stops only)
// colors: array of LittleJS Color stops (top -> bottom)
// options: { steps }
function drawCopperGradient(colors, options = {}) {
  const { steps = 20 } = options;

  // basic validation to avoid silent errors
  if (!colors || colors.length < 2)
    return; // need at least 2 colors

  const bandH = mainCanvasSize.y / steps;
  const stops = colors.length - 1;

  for (let i = 0; i < steps; ++i) {
    const p = i / (steps - 1);
    const scaled = p * stops;
    const idx = Math.floor(scaled);
    const localT = scaled - idx;

    const c1 = colors[idx];
    const c2 = colors[Math.min(idx + 1, stops)];
    const color = c1.lerp(c2, localT);

    drawRect(
      vec2(mainCanvasSize.x / 2, bandH * i + bandH / 2),
      vec2(mainCanvasSize.x, bandH + 1),
      color,
      0,
      true,
      true
    );
  }
}
