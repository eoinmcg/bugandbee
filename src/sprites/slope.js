import { RandomGenerator } from "littlejsengine";
import Sprite from "./sprite";

export default class Slope extends Sprite {

  constructor(g, pos, type = 'bottom') {
    super(pos, vec2(5, 2))

    this.size.y = 12;
    this.g = g;
    if (type === 'bottom') {
      pos.y = -15;
    }

    this.startPos = pos.copy();

    this.name = 'platform';
    this.type = type;

    this.gravity = 0;
    this.col = g.palette.midnight_blue.mk();

    this.fixed = true;
    this.setCollision(true, false);
    this.speed = 1;
    this.velocity = vec2(this.g.level.speed, G.angle);
    this.angle = G.angle;

    this.seed = rand(0, 100);

  }

  update() {
    super.update();

    this.velocity = vec2(this.g.level.speed, G.angle);
    this.angle = G.angle;

    if (this.pos.x < this.g.size.min.x - (this.size.x / 2)) {
      this.pos.x = this.g.size.max.x + (this.size.x / 2);
      // this.size.y = 10;
      this.pos.y = this.startPos.y;
    }
  }

  render() {

    const pos = this.pos.copy().add(vec2(-.2, 0));
    const size = this.size.copy().add(vec2(.4, 0));
    const random = new RandomGenerator(this.seed);


    const surface = this.type === 'bottom'
      ? vec2(0, (size.y / 2) - .5)
      : vec2(0, -(size.y / 2) + .5)

    if (this.type === 'bottom') {
      drawRect(pos.add(vec2(0, -5)), size.add(vec2(.5, 2.5)), this.col, this.angle);
    }

    drawRect(pos, size.add(vec2(.5, 0)), this.col, this.angle);
    drawRect(pos.add(surface), vec2(size.x + 1, 1), new Color(0, 0, 0, 0.5), this.angle);
    drawRect(pos.add(surface).add(vec2(0, .35 * (this.type === 'bottom' ? 1 : -1))), vec2(size.x, .2), new Color(0, 0, 0, .5), this.angle);

    let x = (this.size.x / 2) * .75,
      y = (this.size.y / 2) * .6;
    for (let i = 5; i--;) {
      let pos = vec2(
        random.float(-x, x), random.float(-y, y)
      );
      drawRect(this.pos.add(pos), vec2(.5), new Color(0, 0, 0, random.float(2, 5) / 10));
    }

  }


  collideWithObject(o) {
    if (o.name === 'charge' || o.name === 'bullet') {
      o.destroy();
      return false;
    }



  }

}

