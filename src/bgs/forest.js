import drawSky from "../helpers/drawSky";
import changeBg from "../helpers/changeBg";
import palette from "../data/palette";
import { BgBlock, Mountain, Trunk, Foliage } from "./blocks";

export default class Forest {

  constructor(sky = 'night', speed = 2) {

    this.sky = sky;
    this.speed = speed;

    changeBg(this.sky);

    this.blocks = [];

    let W = 26;

    for (let i = W; i >= -W; i--) {
      const col = palette.midnight_blue.mk();
      if (Math.random() > .3) {
        this.blocks.push(
          new Mountain(
            vec2(i, -9),
            vec2(rand(6, 12)),
            col,
            this.speed * -.01)
        );
      }
    }

    W = 26;

    for (let i = W; i >= -W; i--) {
      const col = BLACK;
      if (Math.random() > .9) {
        this.blocks.push(
          new Trunk(
            vec2(i, -9),
            vec2(rand(2, 3), 50),
            col,
            this.speed * -.02)
        );
      }
    }

    for (let i = W + 10; i >= -W; i--) {
      const col = BLACK;
      this.blocks.push(new BgBlock(vec2(i, -10), vec2(rand(2, 4)), col, this.speed * -.02));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(.09, .05, .09);
      if (Math.random() > .5) {
        this.blocks.push(
          new Trunk(
            vec2(i, -12),
            vec2(rand(1, 2), 50),
            col,
            this.speed * -.05)
        );
      }
    }

    W = 40;
    for (let i = W; i >= -W; i--) {
      const col = new Color(rand(.05, .1), .1, .4);
      this.blocks.push(new BgBlock(vec2(i, -11), vec2(1), col, this.speed * -.05));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(rand(.1, .3), .1, .4);
      this.blocks.push(new BgBlock(vec2(i, -11.5), vec2(1), col, this.speed * -.1));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(rand(.2, .4), .1, .5);
      this.blocks.push(new BgBlock(vec2(i, -12.2), vec2(1), col, this.speed * -.15));
    }

    for (let i = W; i >= -W; i--) {
      const col = new Color(0, rand(.2, .1), 0);
      this.blocks.push(new Foliage(vec2(i, 12.2), vec2(rand(5, 6)), col, this.speed * -.05));
    }
  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    drawSky(this.sky, ['lightning']);
    this.blocks.forEach(block => block.render());
    drawSky(false, ['rain']);
  }
}
