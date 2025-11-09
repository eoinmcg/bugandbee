import Boss from './boss';

export default class SkullBoss extends Boss {

  constructor(g, props) {

    super(g, {
      pos: props.pos,
      size: vec2(3),
      tile: g.tile('skull'),
      health: 30,
      value: 200,
    });

    this.velocity = vec2(-.2, rand(-.1, .1))

  }

  render() {
    const x = this.mirror ? -.25 : .25
    drawRect(this.pos.add(vec2(x, .3)), vec2(3, 1), ORANGE);
    drawRect(this.pos.add(vec2(x, .3)), vec2(3, 1), new Color(1, 0, 0, Math.sin(time * 5)));
    super.render();
  }

  update() {

    super.update();
    const size = this.g.size;
    const half = this.size.x / 2;

    const minX = size.min.x + half;
    const maxX = size.max.x - half;
    const minY = size.min.y + half;
    const maxY = size.max.y - half;

    if (this.pos.x !== clamp(this.pos.x, minX, maxX)) {
      this.pos.x = clamp(this.pos.x, minX, maxX);
      this.velocity.x *= -1;
      this.mirror = this.velocity.x > 0;
    }

    if (this.pos.y !== clamp(this.pos.y, minY, maxY)) {
      this.pos.y = clamp(this.pos.y, minY, maxY);
      this.velocity.y *= -1;
    }

    if (rand() > .98) {
      this.shoot();
    }
  }



}
