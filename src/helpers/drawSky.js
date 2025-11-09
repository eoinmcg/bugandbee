import palette from "../data/palette";
import drawWeather from "./drawWeather";

let skySeed = 6;

export default function drawSky(style = 'dawn', extras = [], speed = 0) {

  const w = mainCanvasSize.x,
    h = mainCanvasSize.y;

  if (style) {
    let { light, med, dark, streak, stops } = styles[style];
    light = palette[light].hex;
    med = palette[med].hex;
    dark = palette[dark].hex;

    mainContext.fillStyle = light;
    mainContext.fillRect(0, 0, w, h);

    mainContext.fillStyle = med;
    mainContext.fillRect(0, 0, w, h / stops[0]);

    mainContext.fillStyle = dark;
    mainContext.fillRect(0, 0, w, h / stops[1]);

    mainContext.fillStyle = light;
    mainContext.fillRect(0, h / stops[0] - (streak * 2), w, streak);

    mainContext.fillStyle = med;
    mainContext.fillRect(0, h / stops[1] - (streak * 2), w, streak);

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
    streak: 10,
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

