import Enemy from "./enemy";
import Particles from "../helpers/particles";

export default class Dropper extends Enemy {
  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(g.size.max.x + 1, 11.3);
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('drop1'),
      health: 0,
      value: 20,
    });

    this.angle = PI
    this.mirror = true

    this.velocity = vec2(this.g.level.speed * .65, 0);
    this.isFalling = false
    this.gravity = 0.008;
  }

  update() {

    let player = this.getRandomPlayer()
    let pos = 0;
    if (player) {
      pos = player.pos.x + 2;
    }

    if (this.pos.x < pos && !this.isFalling) {
      this.isFalling = true
      this.velocity.y = -.01;
      this.velocity.x *= rand(-.15, .15);
      this.mirror = false
    } else {
      this.pos.y += (Math.sin(time * 2) * .005);
    }

    if (this.isFalling) {
      this.velocity.y -= this.gravity;
      this.angle -= .12;
      this.angle = clamp(this.angle, 0, PI);
    }

    if (this.pos.y < -9) {
      this.g.sfx.play("splash", this.pos);
      Particles.swampSplash(this.pos);
      this.destroy(false)
    }

  }

}

