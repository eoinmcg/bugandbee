import Scene from "./scene";

export default class Bgs extends Scene {
  enter(Game) {
    this.g = Game;
    this.mouse = new Mouse();
    this.clouds = [];

    this.spawnCloud();
  }

  render() {
    drawRect(vec2(0), vec2(50, 40), BLUE);
  }

  spawnCloud(startPos) {
    startPos = startPos || vec2(20, 0);
    let size = rand(3, 5);
    const parts = [vec2(2, 1), vec2(1, 0), vec2(2, 0), vec2(3, 0)];
    parts.forEach((pos) => {
      this.clouds.push(new Cloud(this.g, startPos.add(pos), size));
    });
  }
}

class Cloud extends EngineObject {
  constructor(g, pos, size) {
    pos = pos ?? vec2(0);
    console.log(size);
    super(pos, vec2(size));
    this.g = g;
    this.mass = 0;
    this.renderOrder = 0;
    this.velocity = vec2(-0.05, 0);
    this.shadow = new Color(0.9, 0.8, 0.8);
  }

  update() {
    super.update();
    if (this.pos.x < this.g.size.min.x - this.size.x) {
      this.pos.x = this.g.size.max.x + this.size.x;
    }
  }

  render() {
    drawCircle(this.pos.add(vec2(0, -0.3)), this.size.x, this.shadow);
    drawCircle(this.pos, this.size.x, WHITE);
    // drawText("OHAI", this.pos.add(vec2(0, 1)), "RED");
  }
}

class Mouse extends EngineObject {
  constructor() {
    super(vec2(0), vec2(0.25));
    this.setCollision();
    this.mass = 0;
  }

  update() {
    this.pos = mousePos.copy();
  }

  render() {
    drawCircle(this.pos, this.size.x, YELLOW);
  }

  collideWithObject(o) {
    console.log("HIT");
    if (mouseIsDown(0)) {
      console.log(this.key);
    }
  }
}

class ColBox extends EngineObject {
  constructor(pos, size, key, col) {
    super(pos, size);

    this.col = col;
    this.key = key;
    this.shadow = new Color(0, 0, 0, 0.5);
    this.setCollision();
    this.mass = 0;
  }

  render() {
    drawRect(this.pos, this.size, this.col);

    const textPos = this.pos.copy().add(vec2(-0.5, 0));
    drawText(this.key, textPos.add(vec2(-0.08)), 0.7, this.shadow);
    drawText(this.key, textPos, 0.7, WHITE);
  }
}
