import Scene from "./scene";
import isMobile from '../helpers/isMobile';

export default class Splash extends Scene {
  enter(Game) {
    super.enter(Game);
    this.g = Game;

    this.options = ['1 Player', '2 Players', 'Help', 'Settings'];
    this.yPos = [-5, -6.5, -8, -9.5];
    this.pointer = 0;

    if (isMobile()) {
      this.options.shift();
      this.yPos.shift();
      this.options[0] = 'Play';
    }

    this.g.resetStore();
    this.stick = [gamepadDpad(0)];
    this.lastStick = [0];

    this.g.levelNum = 1;
    this.bgCol = rand() > .5 ? 'maroon' : 'orange'
    this.activeTextCol = this.bgCol === 'maroon'
      ? this.g.palette.lime.mk() : this.g.palette.aqua.mk();

    this.initTunnel(this.bgCol, 'black');
  }

  update() {
    super.update();

    const stick = gamepadStick(0);

    if (keyWasPressed('ArrowUp')
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.pointer -= 1;
      this.g.sfx.play('walk');
    }
    if (keyWasPressed('ArrowDown')
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.pointer += 1;
      this.g.sfx.play('walk');
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || keyWasPressed('Space')) {
      const opt = this.options[this.pointer];
      if (opt === 'Help') {
        this.g.sceneManager.changeScene('Help');
      } else if (opt === 'Settings') {
        this.g.sceneManager.changeScene('Settings');
      } else if (opt === '1 Player' || opt === 'Play') {
        this.g.store.p1.type = 'bug';
        this.g.sceneManager.changeScene('Select');
      } else if (opt === '2 Players') {
        this.g.resetStore();
        this.g.store.p1.type = 'BUG';
        this.g.store.p2.type = 'BEE';
        const scene = this.g.plays === 0 ? 'Tutorial' : 'Play';
        this.g.sceneManager.changeScene(scene);
      }

    }

    this.lastStick = [stick.y];

  }


  renderPost() {

    const font = engineFontImage;

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    font.drawText(hi, vec2(0, 11.4), 1, true, BLACK);
    font.drawText(hi, vec2(0, 11.5), 1, true);

    const red = this.g.palette.red.mk();
    const yellow = this.g.palette.yellow.mk();
    mainContext.font = '04b_19';
    setFontDefault('"04b_19"');
    let col = new Color(0, 0, 0, .8);
    drawCircle(vec2(0), 14, col, 0, CLEAR_BLACK, true);
    this.logoText({
      text: '&', pos: vec2(-4, 0), size: 2, color: WHITE,
      lineColor: CLEAR_BLACK
    })
    this.logoText({
      text: 'BuG', pos: vec2(0, 2), size: 4, color: red,
      lineColor: yellow, angle: -.05
    })
    this.logoText({
      text: 'bEE', pos: vec2(.8, -1.7), size: 4, color: yellow,
      lineColor: red, angle: .01
    })

    const wave = Math.sin(new Date().getTime() * 0.009);
    const t = wave > 0 ? 'worm0' : 'worm1';
    drawTile(vec2(-4.5, this.yPos[this.pointer] + .1), vec2(1), this.g.tile(t), undefined, 0, true);
    this.options.forEach((o, i) => {
      let col = this.pointer === i ? this.activeTextCol : WHITE;
      font.drawText(o, vec2(-3, this.yPos[i] - .1), .85, false, BLACK);
      font.drawText(o, vec2(-3, this.yPos[i]), .85, false, col);
    })
  }
}
