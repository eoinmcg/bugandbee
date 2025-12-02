import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class EnemyFire extends Sprite {

  constructor(g, pos, angle, speed = .1) {
    super(pos, vec2(.5), g.tile('circle'));

    this.g = g;
    this.velocity = vec2(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
    );

    this.color = g.palette.pink.mk();
    this.name = 'enemyFire';

    this.speed = speed;
    this.angle = angle;

    this.renderOrder = 3000;

    this.outline = { color: g.palette.red.mk(), offset: .15 }
    // this.outline = { color: BLACK, offset: .15 }

  }

  update() {
    this.angle += .1;
    super.update();
    this.outline.color = new Color(1, Math.sin(time * 5), 0);
  }

  collideWithObject(o) {
    if (o.name === 'player') {
      Particles.sparks(this.pos);
      this.destroy();
    }
  }

}
