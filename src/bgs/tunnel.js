import drawSky from "../helpers/drawSky";
import { Beam } from "./blocks";

export default class Tunnel {

  constructor(sky = 'stormy', speed = 2) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

    let W = 26;
    for (let i = W; i >= -W; i--) {
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
    // drawSky(this.sky, ['fog', 'eyes', 'fireflies']);
    drawSky(this.sky, ['fog']);
    this.blocks.forEach(block => block.render());
  }
}


