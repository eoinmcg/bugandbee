import Enemy from "./enemy";

export default class Spike extends Enemy {
  constructor(g, props = {}) {

    props.size = vec2(1, 8);
    if (!props.pos) {
      props.pos = vec2(g.size.max.x + 2, rand() > .5 ? -14 : 14);
    }
    super(g, props);
    this.velocity = vec2(-.45, 0);
    this.name = 'rock';
    this.type = this.pos.y > 0 ? 'top' : 'bottom';
    this.renderOrder = -2;

    this.startPos = props.pos.copy();
    this.spawnAngle = g.angle;
    this.col = g.palette.red.mk();
  }

  getRandYPos() {
    return rand() > .5
      ? 20
      : -20
  }

  update() {
    super.update();

    this.velocity = vec2(this.g.level.speed, this.g.angle);
    if (this.pos.x < this.g.size.min.x - this.size.x) {
      this.reInit();
    }
  }

  reInit() {
    this.pos.x = this.g.size.max.x + 30;
    this.pos.y = this.getRandYPos();
    this.spawnAngle = this.g.angle;
    this.type = this.pos.y > 0 ? 'top' : 'bottom';
  }

  render() {

    let i = this.size.y, h = this.size.y;
    let halfH = this.type === 'bottom' ? h / 2 : (h / 2) - 1;
    while (i--) {
      let w = this.type === 'bottom'
        ? (h / (i + .9)) / 2
        : (this.size.y + i) / 20;

      drawTile(this.pos.add(vec2(0, i - halfH)), vec2(w, 1), this.g.tile('rock1'), undefined);
    }

    if (this.type === 'bottom') {
      drawTile(this.pos.add(vec2(0, i + (halfH + 1))), vec2(.5, 1), this.g.tile('rock0'), undefined);
    } else {
      drawTile(this.pos.add(vec2(0, i - (halfH - 0))), vec2(.5, 1), this.g.tile('rock0'), undefined, PI, true);
    }

  }



  collideWithObject(o) {
    if (o.name === 'platform') {
      if (this.type === 'bottom') {
        this.pos.y = o.pos.y + (o.size.y / 2)
      } else {
        this.pos.y = o.pos.y - (o.size.y / 2)
      }
    } else {
      // this.reInit();
      return false;
    }
  }



}
