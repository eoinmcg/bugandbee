import { outlineTile } from "../helpers/drawOutline";
import Sprite from "./sprite";

export default class Powerup extends Sprite {

  constructor(g, pos) {
    super(pos, vec2(.5), g.tile('smiley'));
    this.color = BLACK;
    this.g = g;
  }

  update() {
    this.pos.x += 0.01;
    this.pos.y += 0.03;
    super.update();
  }

  collideWithObject(o) {

    if (o.name === 'player') {
      this.g.store[o.player].score += 50;
      this.g.store[o.player].powerups += 1;
      this.destroy();
      this.g.sfx.play('key', this.pos);
    }
  }

  render() {

    outlineTile({
      pos: this.pos,
      size: this.size.add(vec2(.5)),
      tileInfo: this.g.tile('circle'),
      color: YELLOW,
      outlineColor: BLACK,
      outlineOffset: .15,
    });
    super.render();
  }



}
