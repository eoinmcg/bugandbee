import palette from "../data/palette";
import drawWeather from "./drawWeather";

let skySeed = 6;

export default function drawSky(style = 'dawn', extras = [], speed = 0) {


  if (style) {
    let { light, med, dark, streak, stops } = styles[style];
    light = palette[light].mk();
    med = palette[med].mk();
    dark = palette[dark].mk();

    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRectGradient(vec2(0), vec2(w, h), dark, light);
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

