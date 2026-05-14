import drawSky from "../helpers/drawSky";
import changeBg from "../helpers/changeBg";
import { BgBlock, Beam } from "./blocks";

export default class Underground {

  constructor(sky = 'inferno', speed = 2) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

    for (let i = 16; i >= -15; i--) {
      const col = BLACK;
      if (Math.random() > .9) {
        this.blocks.push(
          new Beam(
            vec2(i, -9),
            vec2(rand(2, 3), 50),
            col,
            this.speed * -.15)
        );
      }
    }
  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    drawSky(this.sky, ['fog', 'fireflies']);
    this.blocks.forEach(block => block.render());
  }
}

