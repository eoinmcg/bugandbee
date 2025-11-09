import Enemy from "./enemy";

export default class Spider extends Enemy {

  constructor(g, props = {}) {

    props.pos = props.pos || vec2(15, 11);
    super(g, {
      pos: props.pos,
      size: vec2(1.2),
      tile: g.tile('creep0'),
      health: 2,
      value: 20,
    });

    this.type = 'spider';
    this.anims = {
      creep: ['creep0', 'creep1'],
    };
    this.changeAnim('creep', 0.25);

    this.velocity = vec2(-.05, -rand(.1, .2));
    this.moveTo = rand(-10, -8);
  }




  update() {

    super.update();
    if (this.pos.y < this.moveTo || this.pos.y > this.g.size.max.y) {
      this.velocity.y *= -1;
    }

    if (this.pos.x < 0 && !this.mirror) { this.mirror = true }

  }

  render() {

    drawLine(this.pos, this.pos.add(vec2(0, 40)), .1, new Color(1, 1, 1, .5));
    super.render();

  }




}
