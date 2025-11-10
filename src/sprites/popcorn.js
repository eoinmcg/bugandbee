import Enemy from "./enemy";

export default class Popcorn extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand() > .5 || g.levelNum === 1 ? g.size.max.x : g.size.min.x, rand(-5, 5));
    }
    // if (g.levelNum = 1) { props.pos.x = g.size.max.x; }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('flappy0'),
      health: 0,
      value: 10,
    });

    const anim = this.g.levelNum === 4
      ? 'bat' : 'flappy';

    this.changeAnim(anim, 0.1);
    this.canShoot = rand() > .85;

    const vx = props.pos.x < 0 ? .1 : -.1;
    this.velocity = vec2(vx, 0);

    this.mirror = this.velocity.x > 0;
  }

  update() {
    super.update();
    if ((this.velocity.x > 0 && this.pos.x > this.g.size.max.x + this.size.x)
      || (this.velocity.x < 0 && this.pos.x < this.g.size.min.x - this.size.x)) {
      this.remove();
    }

    if (this.canShoot && rand() > .995) {
      this.shoot();
      this.canShoot = false;
    }
  }

  destroy(explode) {
    super.destroy(explode);
  }
}
