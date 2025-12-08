import { RandomGenerator } from "littlejsengine";
import Sprite from "./sprite";

export default class Platform extends Sprite {

  constructor(g, pos, type = 'bottom') {
    super(pos, vec2(5, 2))

    this.size.y = rand(5, 10);
    this.g = g;

    this.name = 'platform';
    this.type = type;

    this.gravity = 0;
    this.col = g.palette.coffee.mk();

    this.fixed = true;
    this.setCollision(true, false);
    this.speed = 1;
    this.velocity = vec2(this.g.level.speed, 0);

    this.seed = rand(0, 100);

  }

  update() {
    super.update();
    if (this.pos.x < this.g.size.min.x - (this.size.x / 2)) {
      this.pos.x = this.g.size.max.x + (this.size.x / 2);
      this.size.y = this.g.bossFight ? rand(4, 6) : rand(5, 10);
      this.pos.x += 0.01;
    }
  }

  render() {

    const pos = this.pos.copy().add(vec2(-.4, 0));
    const size = this.size.copy().add(vec2(.4, 0));
    const random = new RandomGenerator(this.seed);

    const surface = this.type === 'bottom'
      ? vec2(0, (size.y / 2) - .5)
      : vec2(0, -(size.y / 2) + .5)
    drawRect(pos, size, this.col);
    drawRect(pos.add(surface), vec2(size.x, 1), new Color(0, 0, 0, 0.5));
    drawRect(pos.add(surface).add(vec2(0, .35 * (this.type === 'bottom' ? 1 : -1))), vec2(size.x, .2), new Color(0, 0, 0, .5));

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
