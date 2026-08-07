import Enemy from "./enemy";
import Score from './score';
import Particles from "../helpers/particles";

export default class Bubble extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(rand(g.size.max.x * -.5, g.size.max.x), -10);
    }
    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(rand(1.5, 1.7)),
      tile: g.tile('round'),
      health: 0,
      value: 10,
    });

    this.outline = false
    this.canShoot = false

    const vx = -.1;
    this.velocity = vec2(vx, rand(.05, .1));
    this.col = new Color(1, 1, 0, .7)

  }

  update() {
    super.update();
    this.color = this.col;
    this.angle += .01;
    if ((this.velocity.x > 0 && this.pos.x > this.g.size.max.x + this.size.x)
      || (this.velocity.x < 0 && this.pos.x < this.g.size.min.x - this.size.x)) {
      this.remove();
    }
    this.pos.x += (Math.sin(time * 5)) * .1
  }


  destroy(explode = true) {
    this.dead = true; // prevent double counting
    // super.destroy();

    if (!explode) return;
    console.log('DESTROY')
    new Score(this.g, { value: this.value, pos: this.pos });
    // Particles.swampSplash(this.pos);
    this.g.sfx.play('pop', this.pos);
    super.destroy(false)
  }

}

