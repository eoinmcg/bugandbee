import drawSky from "../helpers/drawSky";
import palette from "../data/palette";
import changeBg from "../helpers/changeBg";
import { BgBlock, Mountain } from "./blocks";

export default class Meadow {

  constructor(sky = 'day', speed = 1) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

    for (let i = 16; i >= -15; i--) {
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

    for (let i = 16; i >= -15; i--) {
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

    for (let i = 16; i >= -16; i--) {
      const col = new Color(0, rand(.1, .2), 0);
      this.blocks.push(new BgBlock(vec2(i, -11), vec2(1), col, this.speed * -.05));
    }

    for (let i = 16; i >= -16; i--) {
      const col = new Color(0, rand(.3, .4), 0);
      this.blocks.push(new BgBlock(vec2(i, -11.5), vec2(1), col, this.speed * -.1));
    }

    for (let i = 16; i >= -16; i--) {
      const col = new Color(0, rand(.6, .7), 0);
      this.blocks.push(new BgBlock(vec2(i, -12.2), vec2(1), col, this.speed * -.15));
    }

  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    // changeBg('dusk');
    drawSky(this.sky, ['stars', 'moonrise', 'cloudsFast', 'fog'], this.speed);

    this.blocks.forEach(block => block.render());
  }

}
