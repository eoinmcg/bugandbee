import { outlineTile } from "../helpers/drawOutline";

export default class Sprite extends EngineObject {

  constructor(pos, size, t, props = {}) {
    super(pos, size, t)
    for (const [key, val] of Object.entries(props)) {
      this[key] = val;
    }

    this.setCollision();

    this.animSpeed = 0.5;
    this.animFrame = 0;
    this.animTimer = 0;

    this.lastPos = this.pos.copy();
  }

  update() {
    if (this.currentAnim) {
      this.runAnim();
    }
    super.update();

    this.lastPos = this.pos.copy();
  }

  render() {
    if (this.outline) {
      this.renderOutline();
    }
    super.render();
  }

  renderOutline() {
    const tileIndex = this.getTileIndex();

    outlineTile({
      pos: this.pos,
      size: this.size,
      tileInfo: tile(tileIndex, this.g.tileSize),
      outlineColor: this.outline.color,
      outlineOffset: this.outline.offset,
      angle: this.angle,
      mirror: this.mirror,
    });
  }

  changeAnim(name, speed = .5) {
    if (this.currentAnim === this.anims[name]) { return; }
    this.currentAnim = this.anims[name];
    this.animSpeed = speed;
    this.animFrame = 0;
    this.animTimer = 0;
  }

  runAnim() {
    this.animTimer += timeDelta;

    if (this.animTimer >= this.animSpeed) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % this.currentAnim.length; // Loop
    }

    this.tileInfo.pos = this.getTextureCoords();
  }

  isOffScreen() {
    const size = this.g.size;
    return this.pos.x < size.min.x
      || this.pos.x > size.max.x
      || this.pos.y < size.min.y
      || this.pos.y > size.max.y;
  }

  getTileIndex() {
    const tileSize = this.tileInfo.size;
    const tilePos = this.tileInfo.pos;
    const textureSize = this.tileInfo.textureInfo.size;

    const tilesPerRow = textureSize.x / tileSize.x;

    const colIndex = Math.round(tilePos.x / tileSize.x);
    const rowIndex = Math.round(tilePos.y / tileSize.y);

    const tileIndex = colIndex + (rowIndex * tilesPerRow);
    return tileIndex;
  }

  getTextureCoords() {
    const tileSize = this.tileInfo.size,
      frame = this.currentAnim[this.animFrame],
      tileNumber = this.g.atlas[frame];

    const textureSize = this.tileInfo.textureInfo.size;
    const tilesPerRow = textureSize.x / tileSize.x;

    const x = (tileNumber % tilesPerRow) * tileSize.x;
    const y = Math.floor(tileNumber / tilesPerRow) * tileSize.y;

    return vec2(x, y);
  }

  findRandom(type) {
    let types = [];
    engineObjects.forEach((o) => {
      if (o.name === type) {
        types.push(o);
      }
    });

    return types.rnd();
  }

  hitStop(callback, delay = 200) {
    setPaused(true);
    this.g.hitStop = true;
    window.setTimeout(() => {
      setPaused(false);
      this.g.hitStop = false;
      if (callback) { callback(); }
    }, delay);
  }

}
