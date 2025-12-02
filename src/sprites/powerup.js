import { timeDelta } from "littlejsengine";
import { outlineTile } from "../helpers/drawOutline";
import Particles from "../helpers/particles";
import Sprite from "./sprite";

export default class Powerup extends Sprite {

  constructor(g, pos, burst = false, size = .5) {
    let type = 'flower';
    if (!burst && rand() > .9) {
      type = 'heart';
    }
    super(pos, vec2(size), g.tile(type));
    this.color = BLACK;
    this.g = g;
    this.velocity = vec2(-.01, .03);
    this.burst = burst;
    this.type = type;

    this.petalColor = this.g.palette.lavender.mk();
    this.petalColor = this.g.palette.yellow.mk();

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
      if (this.type === 'flower') {
        this.g.store[o.player].powerups += 1;
      } else if (this.type === 'heart') {
        this.g.store[o.player].lives += 1;
      }
      this.destroy();
      this.g.sfx.play('key', this.pos);
      Particles.powerup(this.pos,
        this.g.palette[this.type === 'flower' ? 'lemon' : 'pink'].mk()
      );
    }
  }

  render() {

    if (this.type === 'flower') {
      this.renderFlower();
    }
    if (this.type === 'heart') {
      this.renderHeart();
    }
  }

  renderFlower() {
    const rotationSpeed = 0.5;
    const angle = time * rotationSpeed;

    let petals = [];
    for (let i = 0; i < 8; i++) {
      const petalAngle = angle + (i * Math.PI * 2) / 8;
      const offset = 0.4;
      petals.push(vec2(
        Math.cos(petalAngle) * offset,
        Math.sin(petalAngle) * offset
      ));
    }

    petals.forEach((petal) => {
      outlineTile({
        pos: this.pos.add(petal),
        size: this.size.add(vec2(-.3)),
        tileInfo: this.g.tile('circle'),
        color: this.petalColor,
        outlineColor: BLACK,
        outlineOffset: .10,
      });
    });

    // Draw the center circle
    outlineTile({
      pos: this.pos,
      size: this.size.add(vec2(-.1)),
      tileInfo: this.g.tile('circle'),
      color: WHITE,
      outlineColor: BLACK,
      outlineOffset: .10,
      angle: this.angle + .5,
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
