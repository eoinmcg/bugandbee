import Enemy from "./enemy";

export default class Worm extends Enemy {

  constructor(g, props = {}) {
    props.pos = props.pos || vec2(-14, -11);
    super(g, {
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('worm0'),
      health: 0,
      value: 20,
    });

    this.isStatic = props.pos.x >= g.size.max.x;

    this.shots = [1, 2].rnd();

    this.type = 'worm';
    this.mirror = !this.isStatic;
    this.anims = {
      worm: ['worm0', 'worm1'],
      wormStatic: ['worm3'],
    };
    this.changeAnim(this.isStatic ? 'wormStatic' : 'worm', 0.15);

    this.velocity = vec2(this.isStatic ? -.3 : .05, 0);

    this.p1 = this.findRandom('player');
  }

  update() {
    super.update();

    if (rand() > .99 && this.shots) {
      this.shots -= 1;
      this.shoot();
    }

    if (!this.isStatic && this.pos.x > this.g.size.max.x) {
      this.remove();
    }
    if (this.isStatic && this.pos.x < this.g.size.min.x) {
      this.remove();
    }

  }

}
