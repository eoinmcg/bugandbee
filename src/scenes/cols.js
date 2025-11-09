import Scene from './scene';

export default class Cols extends Scene {
  enter(Game) {
    this.g = Game;
    this.mouse = new Mouse();
    // setShowWatermark(false);

    const rowLen = 6;
    let x = -12, y = 11, size = vec2(5, 4)
    Object.keys(this.g.palette).forEach((k, i) => {
      let col = this.g.palette[k].mk();
      const col_index = i % rowLen;

      if (i > 0 && i % rowLen === 0) {
        y -= (size.y);
      }
      new ColBox(vec2(x + (col_index * size.x), y), size, k, col);
    });
  }
}


class Mouse extends EngineObject {
  constructor() {
    super(vec2(0), vec2(.25));
    this.setCollision();
    this.mass = 0;
  }

  update() {
    this.pos = mousePos.copy();
  }

  render() {
    drawCircle(this.pos, this.size.x, BLUE);
  }

  collideWithObject(o) {
    console.log('HIT');
    // if (mouseIsDown(0)) {
    //   console.log(this.key);
    // }
  }
}

class ColBox extends EngineObject {
  constructor(pos, size, key, col) {
    super(pos, size);

    this.col = col;
    this.key = key;
    this.shadow = new Color(0, 0, 0, .5);
    this.setCollision();
    this.mass = 0;
  }

  render() {

    drawRect(this.pos, this.size, this.col);

    const textPos = this.pos.copy().add(vec2(-.5, 0));
    drawTextOverlay(this.key, textPos.add(vec2(-.08)), .7, this.shadow);
    drawTextOverlay(this.key, textPos, .7, WHITE);

  }


}
