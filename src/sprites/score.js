export default class Score extends EngineObject {
  constructor(g, props) {

    super(props.pos, vec2(1));

    Object.assign(this, props);

    // this.mass = 0;
    // this.setCollision(false);

    this.velocity = vec2(0, this.value > 100 ? .02 : .04);
    this.ttl = 2;
    this.g = g;
  }

  update() {
    this.ttl -= timeDelta;
    this.velocity.y += .001;
    if (this.ttl < 0) this.destroy();
  }

  render() {
    let col = this.g.palette[this.value > 100 ? 'yellow' : 'lime'].mk(this.ttl);
    const font = engineFontImage;
    font.drawText('+' + this.value, this.pos, .7, true, col)
  }
}
