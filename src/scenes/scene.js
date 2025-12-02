import { toggleFullscreen } from "littlejsengine";
import Circle from "../sprites/circle";
export default class Scene {
  enter(game) {
    this.g = game;
  }

  exit() { }

  update() {

    if (keyWasPressed('KeyM')) {
      this.g.sfx.toggleMute();
      this.g.toggleMusic();
    }

    if (keyWasPressed('KeyO')) {
      toggleFullScreen();
      // toggleFullscreen();
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

    let i = 12;

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

    drawTextOverlay(props.text,
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

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

