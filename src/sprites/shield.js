import { timeDelta } from "littlejsengine";
import Sprite from "./sprite";

export default class Shield extends Sprite {

  constructor(g, pos, owner) {
    super(pos, vec2(.5), g.tile('round'));
    this.g = g;
    this.owner = owner;
    this.color = this.owner.type === 'BEE'
      ? YELLOW : RED;

    this.radius = 1.5;  // distance from parent
    this.angle = 0
    this.angularSpeed = 2;

    this.name = 'shield';

    this.outline = {
      offset: .15, color: new Color(0, 0, 0, 1)
    }
  }

  update() {

    this.angle += this.angularSpeed * timeDelta;

    const offsetX = Math.cos(this.angle) * this.radius;
    const offsetY = Math.sin(this.angle) * this.radius;

    this.pos.x = this.owner.pos.x + offsetX;
    this.pos.y = this.owner.pos.y + offsetY;

    super.update();
  }

  collidesWithObject(o) {

    console.log(o);
    if (o.name === 'baddie') {
      o.destroy();
    }

  }

}
