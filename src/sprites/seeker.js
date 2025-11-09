import Powerup from './powerup';
import Enemy from "./enemy";

export default class Seeker extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {

      let posY = rand() > .5
        ? g.size.max.x + 2
        : g.size.min.x - 2;
      props.pos = vec2(posY, 0);
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('bat0'),
      health: 0,
      value: 10,
    });

    this.anims = {
      bat: ['bat0', 'bat1'],
    };
    this.changeAnim('bat', 0.1);
    this.canShoot = true;

    const vx = props.pos.x < 0 ? .15 : -.15;
    this.velocity = vec2(
      vx, 0
    );

    this.player = this.getRandomPlayer();
    this.mirror = this.velocity.x > 0;

  }

  update() {
    super.update();

    if (this.player?.pos && this.velocity.x < 0) {
      this.velocity.y = this.pos.y < this.player.pos.y ? .1 : -.1;
    } else {
      this.velocity.y = 0;
    }

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
    if (this.g.levelNum === 3 && rand() > .5) {
      new Powerup(this.g, this.lastPos);
    }
    super.destroy(explode);
  }
}

