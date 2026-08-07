import Scene from './scene';
import Sprite from '../sprites/sprite';

export default class Cols extends Scene {
  enter(Game) {
    this.g = Game;
    this.mouse = new Mouse();

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


class Mouse extends Sprite {
  constructor() {
    super(vec2(0), vec2(.25));
  }

  update() {
    this.pos = mousePos.copy();
    super.update()
  }

  render() {
    drawCircle(this.pos, this.size.x, BLUE);
  }

  collideWithObject(o) {
    if (mouseWasPressed(0)) {
      console.log(o.key, o.col);
    }
  }

}

class ColBox extends Sprite {
  constructor(pos, size, key, col) {
    super(pos, size);

    this.col = col;
    this.key = key;
    this.shadow = new Color(0, 0, 0, .5);
    this.text = this.key.split('_').join('\n');
  }

  render() {
    drawRect(this.pos, this.size, this.col);

    const textPos = this.pos.copy().add(vec2(-.5, 0));
    drawText(this.text, textPos.add(vec2(-.08)), .8, this.shadow);
    drawText(this.text, textPos, .8, WHITE);

  }


}
