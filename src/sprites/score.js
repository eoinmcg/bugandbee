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
    overlayContext.globalAlpha = this.ttl;
    this.g.fonts[this.value > 100 ? 'yellow' : 'lime'].drawTextOverlay('+' + this.value, this.pos, .1);
    overlayContext.globalAlpha = 1;
  }
}
