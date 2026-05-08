import Scene from "./scene";

export default class SEttings extends Scene {
  enter(Game) {
    this.g = Game;

    this.stick = [gamepadStick(0)];
    this.lastStick = [0];

    this.options = ["Mute", "Fullscreen", "Clear HiScore", "Timewarp", "Exit"];
    this.yPos = [0, -1.5, -3, -4.5, -6];
    this.pointer = 0;

    this.initTunnel("emerald", "dark_teal", 0.02, 0.1);
  }

  update() {
    super.update();
    this.handleUiInput();

    if (this.uiInput === 'up') {
      this.pointer -= 1;
      this.g.sfx.play("walk");
    }
    if (this.uiInput === 'down') {
      this.pointer += 1;
      this.g.sfx.play("walk");
    }

    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    if (this.uiInput === 'enter') {
      this.runChoice(this.pointer);
    }

  }

  renderPost() {
    const font = engineFontImage;
    const gray = this.g.palette.gray.mk();

    this.renderTint();

    this.logoText({
      text: "SETTINGS",
      pos: vec2(0, 4),
      size: 2,
      color: WHITE,
      lineColor: this.g.palette.pink.mk(),
    });

    const wave = Math.sin(new Date().getTime() * 0.009);
    const t = wave > 0 ? "drone0" : "drone1";

    drawTile(
      vec2(-4.5, this.yPos[this.pointer] + 0.2),
      vec2(1),
      this.g.tile(t),
      undefined,
      0,
      true,
    );
    this.options.forEach((o, i) => {
      let text = o;
      if (o === "Mute" && this.g.sfx.isMuted) {
        text = "Mute: on";
      }
      if (o === "Mute" && !this.g.sfx.isMuted) {
        text = "Mute: off";
      }
      if (o === "Timewarp" && postProcess.enabled) {
        text = "Timewarp: on";
      }
      if (o === "Timewarp" && !postProcess.enabled) {
        text = "Timewarp: off";
      }
      let col = this.pointer === i ? WHITE : gray;
      font.drawText(text, vec2(-2.5, this.yPos[i]), 0.8, false, col);
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
        this.g.sfx.play("spotted");
      } catch (e) {
        console.log("FAILED TO CLEAR");
      }
    }
    if (option === 3) {
      postProcess.enabled = !postProcess.enabled;
    }
    if (option === 4) {
      this.g.sceneManager.changeScene("Splash");
    }
  }
}
