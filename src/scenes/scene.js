import Circle from "../sprites/circle";
export default class Scene {
  enter(game) {
    this.g = game;

    window.setTimeout(() => {
      mainCanvas.style.zIndex = -999999;
    }, 100)
  }

  exit() { }

  update() {

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

  updatePost() { }

  render() { }

  renderPost() {
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
