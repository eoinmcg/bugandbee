import Circle from "../sprites/circle";
export default class Scene {
  enter(game) {
    this.g = game;

    window.setTimeout(() => {
      // mainCanvas.style.zIndex = -999999;
    }, 100)
  }

  exit() { }

  update() {


    this.g.floatingStick.update();
    this.g.fireButton.update();

    if (keyWasPressed('KeyM')) {
      this.g.sfx.toggleMute();
      this.g.toggleMusic();
    }

    if (keyWasPressed('KeyO')) {
      toggleFullscreen();
    }

    this.skip = false;
    if (mouseWasReleased(0)
      || keyWasReleased('KeySpace')
      || keyWasReleased('KeyEnter')
      || keyWasReleased('KeyX')
      || keyWasReleased('KeyZ')
      || gamepadWasReleased(2)
      || gamepadWasReleased(0)) {
      this.skip = true;
    }

  }

  // for navigating menus on splash screen etc
  handleUiInput() {
    let stick = gamepadDpad(0);
    const swipe = this.g.swipe.dir;
    const isTouchDevice = navigator.maxTouchPoints > 0;

    this.uiInput = false;

    if (keyWasPressed('ArrowUp')
      || swipe === 'up'
      || (this.lastStickY > 0 && stick.y === 0)) {
      this.uiInput = 'up';
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowDown')
      || swipe === 'down'
      || (this.lastStickY < 0 && stick.y === 0)) {
      this.uiInput = 'down';
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowLeft')
      || swipe === 'left'
      || (this.lastStickX < 0 && stick.x === 0)) {
      this.uiInput = 'left';
      this.g.swipe.clear();
    }
    if (keyWasPressed('ArrowRight')
      || swipe === 'right'
      || (this.lastStickX > 0 && stick.x === 0)) {
      this.uiInput = 'right';
      this.g.swipe.clear();
    }

    // Only check enter if no directional swipe was already handled
    if (!this.uiInput) {
      if (keyWasPressed('Enter')
        || keyWasPressed('KeyX')
        || gamepadWasPressed(0)
        || gamepadWasPressed(1)
        || gamepadWasPressed(2)
        || gamepadWasPressed(7)
        || (!isTouchDevice && mouseWasPressed(0))  // only on real mouse
        || swipe === 'tap'
        || keyWasPressed('Space')) {
        this.uiInput = 'enter';
        this.g.swipe.clear();
      }
    }

    this.lastStickY = stick.y;
    this.lastStickX = stick.x;
  }


  updatePost() { }

  render() { }

  renderPost() {
    if (isTouchDevice) {
      this.g.floatingStick.render();
      this.g.fireButton.render();
    }
  }

  renderTint(tint = .7) {
    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRect(vec2(0, 0), vec2(w, h), new Color(0, 0, 0, tint));
  }

  initTunnel(colA, colB, speed = .05, alpha = 1) {

    colA = this.g.palette[colA].mk();
    colB = this.g.palette[colB].mk();

    let i = this.g.widescreen ? 16 : 12;

    while (i--) {
      let col = i % 2 === 0 ? colA : colB;
      if (i) {
        let r = (i * 4) % 80;
        new Circle(vec2(0), r, col, speed, alpha);
      }
    }
  }

  logoText(props) {
    const defaults = {
      text: 'OHAI!',
      pos: vec2(0),
      size: 2,
      color: WHITE,
      lineWidth: .75,
      lineColor: BLACK,
      textAlign: 'center',
      font: '"04b_19',
      fontStyle: 'normal',
      maxWidth: 200,
      angle: 0,
    }

    props = { ...defaults, ...props };

    drawText(props.text,
      props.pos,
      props.size,
      props.color,
      props.lineWidth,
      props.lineColor,
      props.textAlign,
      props.font,
      props.fontStyle,
      props.maxWidth,
      props.angle
    );

  }
}
