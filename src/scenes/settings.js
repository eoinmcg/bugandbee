import Powerup from "../sprites/powerup";
import Scene from "./scene";

export default class SEttings extends Scene {

  enter(Game) {
    this.g = Game;

    this.stick = [gamepadStick(0),];
    this.lastStick = [0];

    this.options = ['Mute', 'Fullscreen', 'Clear HiScore', 'Exit'];
    this.yPos = [0, -1.5, -3, -4.5];
    this.pointer = 0;

    this.initTunnel('emerald', 'dark_teal', .02, .1);
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

    const inputPressed = (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || keyWasPressed('KeyF')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || keyWasPressed('Space'));

    if (inputPressed) {
      this.runChoice(this.pointer);
    }

    this.lastStick = [stick.y];

  }

  renderPost() {

    this.logoText({
      text: 'SETTINGS', pos: vec2(0, 4), size: 2, color: WHITE,
      lineColor: this.g.palette.pink.mk()
    });

    const wave = Math.sin(new Date().getTime() * 0.009);
    const t = wave > 0 ? 'drone0' : 'drone1';

    drawTile(vec2(-4, this.yPos[this.pointer] - .3), vec2(1), this.g.tile(t), undefined, 0, true);
    this.options.forEach((o, i) => {
      let text = o;
      if (o === 'Mute' && this.g.sfx.isMuted) {
        text = 'Mute: on';
      }
      if (o === 'Mute' && !this.g.sfx.isMuted) {
        text = 'Mute: off';
      }
      this.g.fonts[this.pointer === i ? 'white' : 'gray'].drawText(text, vec2(-2.5, this.yPos[i]), .1, false);
    });

  }

  runChoice(option) {
    if (option === 0) {
      this.g.sfx.toggleMute();
      this.g.toggleMusic();
    }
    if (option === 1) {
      toggleFullscreen();
    }
    if (option === 2) {
      try {
        localStorage.clear();
        this.g.hiScore = 500;
        this.g.sfx.play('spotted');
      } catch (e) {
        console.log('FAILED TO CLEAR');
      }
    }
    if (option === 3) {
      this.g.sceneManager.changeScene('Splash');
    }
  }
}
