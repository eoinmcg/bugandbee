import Scene from "./scene";
import Mouse from "../sprites/mouse";

export default class Help extends Scene {

  enter(Game) {
    this.g = Game;

    this.stick = [gamepadStick(0),];
    this.lastStick = [0];

    this.mouse = new Mouse(.1, YELLOW);

    this.initTunnel('emerald', 'dark_teal', .02, .1);
    new Box(vec2(0, -2.4), vec2(18, 1.5), 'https://eoinmcgrath.com');
    new Box(vec2(0, -4.4), vec2(18, 1.5), 'https://not-jam.itch.io/not-jam-music-pack');
    new Box(vec2(0, -6.4), vec2(18, 1.5), 'https://github.com/KilledByAPixel/LittleJS');
  }

  update() {
    super.update();

    const stick = gamepadDpad(0);

    if (keyWasPressed('ArrowUp')
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.g.sfx.play('walk');
    }
    if (keyWasPressed('ArrowDown')
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.g.sfx.play('walk');
    }

    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || keyWasPressed('KeyF')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || keyWasPressed('Space')) {
      this.g.sceneManager.changeScene('Splash');

    }

    this.lastStick = [stick.y];

  }

  renderPost() {

    this.logoText({
      text: 'ABOUT', pos: vec2(0, 10), size: 3, color: WHITE,
      lineColor: this.g.palette.pink.mk()
    });

    this.g.fonts.pink.drawText(`Controls`, cameraPos.add(vec2(-8, 7)), .11, false);
    this.g.fonts.white.drawText(`p1: Arrow keys + space \np2: WASD + f\n\nor use a gamepad`, cameraPos.add(vec2(-8, 5)), .1, false);
    this.g.fonts.white.drawText(`Hold in fire for a mega shot`, cameraPos.add(vec2(-8, 1)), .1, false);

    this.g.fonts.gray.drawText(`code & gfx: @eoinmcg`, cameraPos.add(vec2(-8, -2)), .1, false);
    this.g.fonts.gray.drawText(`music: not-jam.itch.io`, cameraPos.add(vec2(-8, -4)), .1, false);
    this.g.fonts.gray.drawText(`made with: LittleJS`, cameraPos.add(vec2(-8, -6)), .1, false);

    this.g.fonts.gray.drawText(`Press fire to quit`, cameraPos.add(vec2(-4, -10)), .08, false);

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

class Box extends EngineObject {
  constructor(pos, size, link) {
    super(pos, size);
    this.setCollision();

    this.hover = false;
    this.color = new Color(1, 1, 1, 0);
    this.active = new Color(1, 1, 0, .1);

    if (link) {
      this.link = link;
    }

  }

  update() {
    if (this.hover && mouseWasPressed(0)) {
      console.log('CLICK', this.link);
      const a = document.createElement('a');
      a.href = this.link;
      a.target = '_blank';
      a.click();
    }
    this.hover = false;
    super.update();

  }

  render() {
    drawRect(this.pos, this.size, this.hover ? this.active : this.color);
  }

  collideWithObject(o) {
    this.hover = true;
  }
}
