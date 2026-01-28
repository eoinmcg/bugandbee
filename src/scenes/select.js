import Scene from "./scene";

export default class Select extends Scene {
  enter(Game) {
    this.g = Game;

    this.change = false;
    this.bgColor = new Color(0.1, 0.1, 0.1);

    this.active = 0;
    this.stick = [gamepadDpad(0)];
    this.lastStick = [0];

    this.frameCount = 0;
    this.frame = 0;

    this.initTunnel("emerald", "dark_teal", 0, 0.09);
  }

  update() {
    const stick = gamepadStick(0);

    this.frameCount += timeDelta * 9;
    if (this.frameCount > 1) {
      this.frameCount = 0;
      this.frame = this.frame >= 2 ? 0 : (this.frame += 1);
    }

    if (
      keyWasPressed("ArrowLeft") ||
      (this.lastStick[0] < 0 && stick.x === 0)
    ) {
      this.active -= 1;
      this.g.sfx.play("walk");
    }
    if (
      keyWasPressed("ArrowRight") ||
      (this.lastStick[0] > 0 && stick.x === 0)
    ) {
      this.active += 1;
      this.g.sfx.play("walk");
    }

    if (this.active < 0) this.active = 1;
    if (this.active > 1) this.active = 0;

    if (
      keyWasPressed("Enter") ||
      keyWasPressed("KeyX") ||
      gamepadWasPressed(0) ||
      gamepadWasPressed(1) ||
      gamepadWasPressed(2) ||
      keyWasPressed("Space")
    ) {
      this.g.sfx.play("alert");
      this.g.store.p1.type = this.active === 1 ? "BEE" : "BUG";
      const scene = this.g.plays === 0 ? "Tutorial" : "Play";
      this.g.sceneManager.changeScene(scene);
    }

    this.lastStick = [stick.x];
  }

  renderPost() {
    const font = engineFontImage;

    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRect(vec2(0, 0), vec2(w, h), new Color(0, 0, 0, 0.9));

    this.logoText({
      text: "SELECT",
      pos: vec2(0, 10),
      size: 3,
      color: WHITE,
      lineColor: BLACK,
    });

    drawRect(vec2(-5, 0), vec2(8.4), this.active === 0 ? RED : BLACK);
    drawRect(vec2(-5, 0), vec2(8), this.bgColor);
    const bugFrame = this.active === 0 ? `bug${this.frame}` : "bug3";
    drawTile(vec2(-5, 0), vec2(4), this.g.tile(bugFrame));
    let col = this.active === 0 ? "red" : "gray";
    font.drawText(
      "BUG",
      vec2(-5, -6),
      this.active === 0 ? 1.2 : 1,
      true,
      this.g.palette[col].mk(),
    );

    drawRect(vec2(5, 0), vec2(8.4), this.active === 1 ? YELLOW : BLACK);
    drawRect(vec2(5, 0), vec2(8), this.bgColor);
    const beeFrame = this.active === 1 ? `bee${this.frame}` : "bee3";
    drawTile(vec2(5, -1), vec2(4), this.g.tile(beeFrame));
    col = this.active === 1 ? "yellow" : "gray";
    font.drawText(
      "BEE",
      vec2(5, -6),
      this.active === 1 ? 1.2 : 1,
      true,
      this.g.palette[col].mk(),
    );
  }
}
