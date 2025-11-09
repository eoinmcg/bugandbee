export default class Mouse extends EngineObject {
  constructor(size = .25, col = BLUE) {
    super(vec2(0), vec2(size));
    this.col = col;

    this.setCollision();

  }

  update() {
    this.pos = mousePos.copy();
  }

  render() {
    drawCircle(this.pos, this.size.x, this.col);
  }
}

