import Scene from "./scene";
import Meadow from "../bgs/meadow";
import Forest from '../bgs/forest';
import Swamp from '../bgs/swamp';
import Tunnel from '../bgs/tunnel';

import Enemy from "../sprites/enemy";
import Mouse from "../sprites/mouse";

export default class Waver extends Scene {

  enter(Game) {
    this.g = Game;

    this.points = [];
    this.mouse = new Mouse();
    // const skies = ['day', 'dusk', 'night', 'dawn']
    const skies = ['dawn']
    const scenes = [Meadow, Forest, Swamp]
    const scene = scenes.rnd()

    // this.BG = new scene(skies.rnd(), 1);
    this.BG = new Tunnel('swamp', 1);
  }

  update() {
    super.update();
    this.BG.update();

    if (mouseWasPressed(0)) {
      this.points.push(
        new Point(mousePos)
      );
    }

    if (keyWasPressed('KeyX')) {
      console.log('x', this.points)
      this.points.forEach((p) => {
        p.destroy()
      })
      this.points = [];
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

    drawText(mousePos.x.toFixed(1) + ',' + mousePos.y.toFixed(1), cameraPos.add(vec2(0, 4)), .1);
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
