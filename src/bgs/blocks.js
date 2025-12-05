import Game from "../core/game";
import Config from "../data/config";

export class BgBlock {
  constructor(pos, size, col, speed, shape) {
    this.pos = pos;
    this.size = size;
    this.col = col;
    this.speed = speed;
    this.pos.y += rand(0, .2);
    this.maxW = Game.widescreen ? 32 : 18;
  }


  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) this.pos.x = this.maxW;
  }

  render() {
    drawRect(this.pos.add(vec2(-.25, 0)), this.size.add(vec2(.5, 0)), this.col);
  }
}


export class Foliage extends BgBlock {

  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) {
      this.pos.x = this.maxW;
    }
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.circle, Config.tileSize), this.col, .7);
  }

}

export class Mountain extends BgBlock {

  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) this.pos.x = this.maxW;
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.square, Config.tileSize), this.col, .7);
  }

}

export class Trunk extends BgBlock {

  update() {
    if (Math.abs(this.angle) === 0) {
      this.resetAngle();
    }

    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) {
      this.pos.x = this.maxW;
      this.resetAngle();
    }
  }

  resetAngle() {
    this.angle = rand(-.01, .01);
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.square, Config.tileSize), this.col, this.angle);
  }
}

export class Beam extends Trunk {
  resetAngle() {
    this.angle = rand(-.2, .2);
  }

}
