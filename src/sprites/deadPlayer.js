import Sprite from "./sprite";
import Particles from "../helpers/particles";

export default class DeadPlayer extends Sprite {
  constructor(g, pos, type = 'BEE') {

    const props = { g, type };
    const t = g.tile(type.toLowerCase() + 'Dead');
    super(pos, vec2(1), t, props);

    this.angle = .3;
    this.mass = 0;
    this.size = vec2(1.2);

    this.velocity = vec2(.1, -.1);

  }

  update() {
    super.update();

    if (rand() > .5) {
      Particles.damage(this.pos, 1);
    }

    if (this.pos.y < -15) this.destroy();
  }

}
