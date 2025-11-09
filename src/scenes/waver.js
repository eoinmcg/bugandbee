import Scene from "./scene";
import Meadow from "../bgs/meadow";
import Enemy from "../sprites/enemy";
import Mouse from "../sprites/mouse";

export default class Waver extends Scene {

  enter(Game) {
    this.g = Game;

    this.points = [];
    this.mouse = new Mouse();

    this.BG = new Meadow('dusk', 0);
  }

  update() {
    super.update();
    this.BG.update();

    if (mouseWasPressed(0)) {
      this.points.push(
        new Point(mousePos)
      );
    }

    if (keyWasPressed('Enter')) {
      let p = 'path: [\n';
      const pathOveride = []
      this.points.forEach((point) => {
        // p.push([point.pos.x.toFixed(1), point.pos.y.toFixed(1)]);
        p += `vec2(${point.pos.x.toFixed(1)}, ${point.pos.y.toFixed(1)}),`
        p += '\n';
        pathOveride.push(point.pos);

      });
      p += '],';
      console.log('\n', p);
      navigator.clipboard.writeText(p);
      const b = new Enemy(this.g, { pathOveride });
      console.log('* Path copied to clipboard');
    }

  }

  render() {
    this.BG.render();

    this.points.forEach((p, i) => {
      if (p.destroyed) {

        this.points.splice(i, 1);
      } else {
        drawText(i, p.pos.add(vec2(-.5, 0)));
      }
    });

    this.g.fonts.gray.drawText(mousePos.x.toFixed(1) + ',' + mousePos.y.toFixed(1), cameraPos.add(vec2(0, 4)), .1, true);
  }

}


class Point extends EngineObject {

  constructor(pos) {
    super(pos, vec2(.5));

    this.setCollision();
    this.color = RED;

  }

  update() {
    this.color = RED;
    super.update();
  }

  render() {
    drawRect(this.pos, this.size, this.color);
  }

  collideWithObject(o) {
    this.color = YELLOW;
    if (keyIsDown('KeyX')) {
      this.destroy();
    }
  }

}
