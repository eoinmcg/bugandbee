import Particles from '../helpers/particles';
import Sprite from './sprite'

export default class Bullet extends Sprite {
  constructor(pos, props) {

    const t = props.g.tile('bullet');
    super(pos, vec2(1), t, props);

    this.speed = 2;

    // this.velocity = vec2(this.speed, this.angle * -.5);
    const velocityX = Math.cos(props.angle) * this.speed;
    const velocityY = Math.sin(props.angle) * this.speed;

    this.angle = props.angle * -1;

    this.velocity = vec2(velocityX, velocityY);
    this.mass = 0;

    this.outline = {
      offset: .1, color: RED
    }
  }

  update() {
    super.update();

    if (this.isOffScreen()) {
      this.destroy();
    }
  }

  collideWithObject(o) {
    if (o.name === 'platform' || o.name === 'rock') {
      Particles.gunsmoke(this.pos);
      this.destroy();
    }
  }
}
