import drawSky from "../helpers/drawSky";
import { BgWater, BgBlock, BgSwampTree, SwampFoliage } from "./blocks";

export default class Swamp {

  constructor(sky = 'swamp', speed = 1) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

    let W = 40;
    // for (let i = W; i >= -W; i--) {
    //   const col = new Color(0, rand(.2, .1), 0);
    //   this.blocks.push(new SwampFoliage(vec2(i, 12.2), vec2(rand(5, 6)), col, this.speed * -.05));
    // }

    W = 26;
    for (let i = W + 10; i >= -W; i--) {
      const col = BLACK;
      this.blocks.push(new BgBlock(vec2(i, -10), vec2(rand(2, 4)), col, this.speed * -.02));
    }



    for (let i = -W; i <= W; i += 6) {
      const height = rand(6, 10);
      const width = rand(2.5, 4);
      const treeSpeed = this.speed * -0.06; // Parallax speed matching background blocks

      this.blocks.push(
        new BgSwampTree(
          vec2(i + rand(-2, 2), -8), // Position base near ground level
          vec2(width, height),
          treeSpeed
        )
      );
    }
    W = 40;


    for (let i = W; i >= -W; i--) {
      const col = new Color(0, .2, .1);
      this.blocks.push(new BgWater(vec2(i, -11.2), vec2(1), col, this.speed * -.15));
    }

  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    drawSky(this.sky, ['fog', 'fireflies'], this.speed);

    this.blocks.forEach(block => block.render());
  }

}

