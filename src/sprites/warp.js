import { outlineTile } from "../helpers/drawOutline";

export default class Warp extends EngineObject {

  constructor(g, pos, props = {}) {
    super(pos, vec2(1), tile(0, 16, 1, 0, .5));
    this.ttlStart = props.ttl || 20;
    this.ttl = this.ttlStart;
    this.outline = true;
    this.g = g;
    this.callback = props.callback;
    this.color = props.color || RED.copy();
    this.callbackCalled = false;

    this.renderOrder = 1000;
    console.log(this.color);
  }

  update() {
    this.ttl -= timeDelta;
    this.color.a -= .002;
    if (this.size.x < 15) {
      this.size = vec2(this.size.x + .5);
    }

    this.angle += .02
    
    if (this.ttl < 0) {
      if (this.callback) {
      this.callback();
      }
      this.destroy();
    }
  }

  render() {
    super.render()
      // outlineTile({
      //   pos: this.pos,
      //   size: vec2( this.ttl * 2),
      //   tileInfo: this.g.tile("circle"),
      //   color: CLEAR_BLACK,
      //   angle: -time,
      //   outlineColor: YELLOW,
      //   outlineOffset: 0.5,
      // });
  }


}
