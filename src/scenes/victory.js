import Scene from "./scene";
import Meadow from '../bgs/meadow';
import { outlineTile } from "../helpers/drawOutline";
import Alert from '../sprites/alert';

export default class Victory extends Scene {

  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.stick = [gamepadStick(0),];
    this.lastStick = [0];

    this.startTime = time;
    this.bg = new Meadow('dusk');
    this.g.playMusic(1);
    new Alert(this.g, { text: 'VICTORY!', fonts: this.g.fonts });
    this.dance = false;
    window.setTimeout(() => {
      new Alert(this.g, { text: 'U DA BEST!', fonts: this.g.fonts });
      this.g.playMusic(2);
      this.dance = true;
    }, 2000);

    this.g.medals[4].unlock();

  }

  update() {
    super.update();

    const stick = gamepadStick(0);

    if (keyWasPressed('ArrowUp')
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      // this.g.sfx.play('walk');
    }
    if (keyWasPressed('ArrowDown')
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      // this.g.sfx.play('walk');
    }

    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || keyWasPressed('Space')) {
      this.exit();
    }

    this.lastStick = [stick.y];

  }

  exit() {
    if (time - this.startTime < 3) return;
    this.g.levelNum = 1;
    this.g.sceneManager.changeScene('Splash');
  }

  render() {
    const random = new RandomGenerator(42);
    window.R = random;
    this.bg.render();

    const s = sin(time * 9) * .25;
    const pSize = this.dance
      ? vec2(3 - s, 3 + s) : vec2(3);
    outlineTile({
      pos: vec2(-7, -9.5),
      size: pSize,
      tileInfo: tile(15, this.g.tileSize),
      outlineColor: BLACK,
      outlineOffset: .5,
      angle: 0,
      mirror: false
    });
    outlineTile({
      pos: vec2(7, -10.2),
      size: pSize,
      tileInfo: tile(9, this.g.tileSize),
      outlineColor: BLACK,
      outlineOffset: .5,
      angle: 0,
      mirror: true
    });
    if (this.dance) {
      outlineTile({
        pos: vec2(0, s + 3),
        size: vec2(pSize.x * 2),
        color: this.g.palette.bubblegum.mk(),
        tileInfo: tile(19, this.g.tileSize),
        outlineColor: BLACK,
        outlineOffset: .5,
        angle: 0,
        mirror: true
      });
    }

    let i = 50;
    const size = this.g.size;
    while (i--) {
      let x = random.float(size.min.x, size.max.x),
        y = random.float(-12, -11),
        col = !this.dance ? WHITE : [WHITE, YELLOW, RED, ORANGE, BLUE, GREEN].rnd();
      drawTile(vec2(x, y), vec2(1), this.g.tile('flower'), col)
    }
  }
}


