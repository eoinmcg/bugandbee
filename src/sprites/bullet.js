import Particles from '../helpers/particles';
import Sprite from './sprite'

export default class Bullet extends Sprite {
  constructor(pos, props) {

    const t = props.g.tile('bullet');
    super(pos, vec2(1), t, props);
    console.log(this.g.level.data.floor)

    this.speed = 2;

    let velocityX = Math.cos(props.angle) * this.speed;
    let velocityY = Math.sin(props.angle) * this.speed;

    if (props.mirror) {
      velocityX *= -1;
      this.angle = props.angle;
    } else {
      this.angle = props.angle * -1;
    }


    this.velocity = vec2(velocityX, velocityY);
    this.mass = 0;

    this.outline = {
      offset: .1, color: RED
    }
    this.floor = this.g.level.data?.floor || false;
  }

  update() {
    super.update();

    if (this.isOffScreen()) {
      this.destroy();
    }
    if (this.floor && this.pos.y < this.floor) {
      const effect = this.g.level.data.floorEffect;
      Particles[effect](this.pos);
      this.destroy()
    }
  }

  collideWithObject(o) {
    if (o.name === 'platform' || o.name === 'rock') {
      Particles.gunsmoke(this.pos);
      this.destroy();
    }
  }
}
