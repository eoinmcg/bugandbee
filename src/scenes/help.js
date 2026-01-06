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

    const font = engineFontImage;

    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRect(vec2(0, 0), vec2(w, h), new Color(0, 0, 0, 0.9));

    this.logoText({
      text: 'ABOUT', pos: vec2(0, 10), size: 3, color: WHITE,
      lineColor: this.g.palette.pink.mk()
    });

    font.drawText(`Controls`, vec2(-8, 7), 1.1, false, this.g.palette.pink.mk());
    font.drawText(`p1: Arrow keys + space \np2: WASD + f\n\nor use a gamepad`, vec2(-8, 5), .8, false);
    font.drawText(`Hold in fire for a mega shot`, vec2(-8, 1), .8, false);

    const gray = this.g.palette.gray.mk();
    font.drawText(`code & gfx: @eoinmcg`, vec2(-8, -2), .8, false, gray);
    font.drawText(`music: not-jam.itch.io`, vec2(-8, -4), .8, false, gray);
    font.drawText(`made with: LittleJS`, vec2(-8, -6), .8, false, gray);

    font.drawText(`Press fire to quit`, vec2(-4, -10), .8, false, gray);

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

  renderPost() {
    drawRect(this.pos, this.size, this.hover ? this.active : this.color);
  }

  collideWithObject(o) {
    this.hover = true;
  }
}
