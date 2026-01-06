import Game from "../core/game";

export default class Circle extends EngineObject {
  constructor(pos, r, col, speed, alpha) {
    super(pos, vec2(1))
    this.col = col;
    this.r = r;
    this.speed = speed;
    this.maxSize = Game.widescreen ? 64 : 44;
    this.minSize = 4;
    this.alpha = alpha;
  }

  update() {
    this.r += this.speed;
    if (this.r > this.maxSize) {
      this.r = this.minSize;
    }
  }

  render() {
    // if (this.alpha !== 1) {
    //   mainContext.globalAlpha = this.alpha;
    // }
    drawCircle(this.pos, this.r, CLEAR_BLACK, 2, this.col);
    // if (this.alpha !== 1) {
    //   mainContext.globalAlpha = 1;
    // }
  }
}

