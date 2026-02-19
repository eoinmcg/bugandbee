import Particles from "../helpers/particles";
import Sprite from "./sprite";

export default class Charge extends Sprite {
  constructor(g, pos, angle = 0, size = 1, mirror = false, owner = 'p1') {

    const t = g.tile('circle');
    const props = {
      g: g,
      name: 'charge',
      owner: owner,
      angle: angle,
      color: WHITE,
      speed: 1,
    }
    super(pos, vec2(size / 5), t, props);

    let velocityX = Math.cos(props.angle) * this.speed;
    let velocityY = Math.sin(props.angle) * this.speed;

    if (mirror) {
      velocityX *= -1;
      this.angle = angle;
    } else {
      this.angle = angle * -1;
    }

    this.velocity = vec2(velocityX, velocityY);

    this.outline = {
      offset: .2, color: RED
    }

  }

  update() {
    super.update();

    this.angle += 0.1;

    this.g.sfx.play('jet', this.pos);

    Particles.gunsmoke(this.pos.add(vec2(.5, 0)));
    if (this.isOffScreen()) {
      this.destroy();
    }
  }

  destroy() {
    super.destroy();
  }


  collideWithObject(o) {
    if (o.name === 'platform' || o.name === 'rock') {
      Particles.gunsmoke(this.pos);
      Particles.gunsmoke(this.pos.add(vec2(1, 1)));
      Particles.gunsmoke(this.pos.add(vec2(-1, -1)));
      this.destroy();
    }
  }

}
