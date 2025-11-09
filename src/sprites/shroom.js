import Enemy from "./enemy";

export default class Shroom extends Enemy {

  constructor(g, props = {}) {

    props.pos = props.pos || vec2(g.size.max.x + 1, -11);
    super(g, {
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('shroom'),
      health: 2,
      value: 50,
    });


    this.velocity = vec2(this.g.level.speed, 0);
    this.launched = false;
    this.adjusted = false;

    this.players = this.getPlayers();

  }

  update() {
    if (this.pos.x < this.g.size.min.x
      || this.pos.y > this.g.size.max.y) {
      this.remove();
    }

    this.players.forEach((p) => {
      if (!this.launched && this.pos.x - rand(2, 3) < p.pos.x) {
        this.launched = true;
        this.velocity.y = 0.5;
      }
    })


    super.update();
  }

  collideWithObject(o) {
    if (o.name === 'platform' && !this.launched && !this.adjusted) {
      // this.adjusted = true;
      this.pos.y = o.pos.y + (o.size.y / 2) + this.size.y / 2;
    }
    super.collideWithObject(o);
  }

}

