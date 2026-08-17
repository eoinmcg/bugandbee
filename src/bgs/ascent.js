import drawSky from "../helpers/drawSky";

export default class Ascent {
  constructor(sky = 'swamp', speed = 1) {

    this.sky = sky;
    this.speed = speed;

    this.blocks = [];

  }

  update() {
    if (this.speed === 0) return;
    this.blocks.forEach(block => block.update());
  }

  render() {
    drawSky(this.sky, ['fog', 'pollen'], this.speed);

    this.blocks.forEach(block => block.render());
  }

}
