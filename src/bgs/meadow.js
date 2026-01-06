import drawSky from "../helpers/drawSky";
import palette from "../data/palette";
import { BgBlock, Mountain } from "./blocks";

export default class Meadow {

  constructor(sky = 'day', speed = 1) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

    let W = 26;

    for (let i = W; i >= -W; i--) {
      const col = BLACK;
      if (Math.random() > .3) {
        this.blocks.push(
          new Mountain(
            vec2(i, -9),
            vec2(rand(6, 8)),
            col,
            this.speed * -.01)
        );
      }
    }

    for (let i = W; i >= -W; i--) {
      const col = palette.midnight_blue.mk();
      if (Math.random() > .3) {
        this.blocks.push(
          new Mountain(
            vec2(i, -12),
            vec2(rand(6, 10)),
            col,
            this.speed * -.02)
        );
      }
    }

    W = 40;
    for (let i = W; i >= -W; i--) {
      const col = new Color(0, rand(.1, .2), 0);
      this.blocks.push(new BgBlock(vec2(i, -11), vec2(1), col, this.speed * -.05));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(0, rand(.3, .4), 0);
      this.blocks.push(new BgBlock(vec2(i, -11.5), vec2(1), col, this.speed * -.1));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(0, rand(.6, .7), 0);
      this.blocks.push(new BgBlock(vec2(i, -12.2), vec2(1), col, this.speed * -.15));
    }

  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    drawSky(this.sky, ['stars', 'moonrise', 'cloudsFast'], this.speed);

    // drawRect(vec2(0, -9), vec2(60, 3), BLACK);
    this.blocks.forEach(block => block.render());
  }

}
