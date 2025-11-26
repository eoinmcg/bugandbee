import { timeDelta } from "littlejsengine";
import { outlineTile } from "../helpers/drawOutline";
import Particles from "../helpers/particles";
import Sprite from "./sprite";

export default class Powerup extends Sprite {

  constructor(g, pos, burst = false) {
    let type = 'smiley';
    if (!burst && rand() > .9) {
      type = 'heart';
    }
    super(pos, vec2(.5), g.tile(type));
    this.color = BLACK;
    this.g = g;
    this.velocity = vec2(.01, .03);
    this.burst = burst;
    this.type = type;

    if (burst) {
      this.velocity = vec2().setAngle(burst, .06);
      this.pos = this.pos.add(vec2().setAngle(burst, 2));
    }
  }

  update() {
    if (this.burst) {
      this.angle += timeDelta * 3;
    }
    if (this.isOffScreen()) {
      this.destroy();
    }
    super.update();
  }

  collideWithObject(o) {

    if (o.name === 'player') {
      this.g.store[o.player].score += 50;
      if (this.type === 'smiley') {
        this.g.store[o.player].powerups += 1;
      } else if (this.type === 'heart') {
        this.g.store[o.player].lives += 1;
      }
      this.destroy();
      this.g.sfx.play('key', this.pos);
      Particles.powerup(this.pos,
        this.g.palette[this.type === 'smiley' ? 'lemon' : 'pink'].mk()
      );
    }
  }

  render() {

    if (this.type === 'smiley') {
      this.renderSmiley();
      super.render();
    }
    if (this.type === 'heart') {
      this.renderHeart();
    }
  }

  renderSmiley() {
    outlineTile({
      pos: this.pos,
      size: this.size.add(vec2(.5)),
      tileInfo: this.g.tile('circle'),
      color: YELLOW,
      outlineColor: BLACK,
      outlineOffset: .15,
    });
  }

  renderHeart() {
    const s = Math.abs(sin(time * 5) * .5);

    outlineTile({
      pos: this.pos,
      size: this.size.add(vec2(s)),
      color: this.g.palette.pink.mk(),
      tileInfo: this.g.tile('heart'),
      // outlineColor: this.g.palette.red.mk(),
      outlineColor: BLACK,
      outlineOffset: .15,
    });
  }
}
