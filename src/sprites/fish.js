import Enemy from "./enemy";
import Particles from "../helpers/particles";

export default class Fish extends Enemy {

  constructor(g, props = {}) {

    if (!props.pos) {
      props.pos = vec2(g.size.max.x - 2, -9);
    }

    super(g, {
      waveId: props?.waveId,
      pos: props.pos,
      size: vec2(1),
      tile: g.tile('fish0'),
      health: 0,
      value: 20,
    });

    const anim = 'fish';
    this.changeAnim(anim, 0.1);
    this.hasSplashed = false

    // Gravity force pulling down each frame
    this.gravity = 0.008;

    let player = this.getRandomPlayer();

    if (player) {
      // 1. Calculate relative distance to target
      const diff = player.pos.subtract(this.pos);

      // 2. Desired peak arc height above the higher of the two positions
      const arcHeight = Math.max(diff.y, 0) + 4;

      // 3. Solve for initial vertical velocity (vy = sqrt(2 * g * height))
      const vy = Math.sqrt(2 * this.gravity * arcHeight);

      // 4. Solve for time to reach target under gravity
      // t = time to apex + time from apex down to target height
      const tApex = vy / this.gravity;
      const fallDistance = arcHeight - diff.y;
      const tFall = Math.sqrt((2 * fallDistance) / this.gravity);
      const totalTime = tApex + tFall;

      // 5. Solve for constant horizontal velocity needed to hit player in totalTime
      const vx = diff.x / totalTime;

      this.velocity = vec2(vx, vy);
    } else {
      // Default fall-back trajectory if no player exists
      this.velocity = vec2(-0.1, 0.3);
    }

    this.g.sfx.play("splash", this.pos);
    Particles.swampSplash(this.pos)
    this.angle = PI * .25


  }

  update() {
    this.velocity.y -= this.gravity;

    if (this.velocity.y < 0 && this.angle > (PI * -.25)) {
      this.angle -= 0.05;
    }


    super.update();

    if (this.pos.y < -9 && !this.hasSplashed && this.velocity.y < 0) {
      console.log('splash')
      this.g.sfx.play("splash", this.pos);
      Particles.swampSplash(this.pos)
      this.hasSplashed = true
    }

    if (
      this.pos.y < this.g.size.min.y - this.size.y ||
      (this.velocity.x > 0 && this.pos.x > this.g.size.max.x + this.size.x) ||
      (this.velocity.x < 0 && this.pos.x < this.g.size.min.x - this.size.x)
    ) {
      this.remove();
    }
  }

  destroy(explode) {
    super.destroy(explode);
  }
}
