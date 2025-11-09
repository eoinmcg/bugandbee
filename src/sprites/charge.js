import Particles from "../helpers/particles";
import Sprite from "./sprite";

export default class Charge extends Sprite {
  constructor(g, pos, angle = 0, size = 1, owner = 'p1') {

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

    // this.velocity = vec2(this.speed, 0);
    const velocityX = Math.cos(props.angle) * this.speed;
    const velocityY = Math.sin(props.angle) * this.speed;
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
