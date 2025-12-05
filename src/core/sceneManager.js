import Splash from "../scenes/splash.js";
import Help from "../scenes/help.js";
import Select from "../scenes/select.js";
import Play from "../scenes/play.js";
import LevelComplete from "../scenes/levelComplete.js";
import Tutorial from "../scenes/tutorial";
import Victory from "../scenes/victory.js";
import Settings from "../scenes/settings.js";

// dev mode only
import Waver from "../scenes/waver.js";
import Cols from "../scenes/cols";
import { mainCanvas } from "littlejsengine";

const Scenes = {
  'Splash': Splash,
  'Help': Help,
  'Settings': Settings,
  'Tutorial': Tutorial,
  'Select': Select,
  'Play': Play,
  'LevelComplete': LevelComplete,
  'Victory': Victory,
  'Waver': Waver,
  'Cols': Cols,
}

export default class SceneManager {
  constructor(Game) {
    this.g = Game;
    this.currentScene = null;
    this.lastChange = 500;
  }

  changeScene(newScene, data = {}, effect = 'complete', force = false) {
    const delta = new Date().getTime() - this.lastChange;
    if (!force && delta < 1000) {
      return;
    }

    try {
      this.g.stopMusic();
    } catch (e) { }

    this.lastChange = new Date().getTime();
    document.body.classList.add(effect);

    window.setTimeout(() => {
      if (this.currentScene) {
        this.currentScene.exit();
      }
      engineObjectsDestroy();

      this.clearInput();
      document.body.classList.remove(effect);
      this.currentScene = new Scenes[newScene];
      this.currentScene.enter(this.g, data);
    }, 250);
  }

  update() {
    if (this.currentScene) {
      this.currentScene.update();
    }
  }

  updatePost() {
    if (this.currentScene) {
      this.currentScene.updatePost();
    }
  }

  render() {
    if (this.currentScene) {
      this.currentScene.render();
    }
  }

  renderPost() {
    if (this.currentScene) {
      this.currentScene.renderPost();
    }
  }

  clearInput() {
    inputClear();
    for (let key in keyIsDown) {
      keyIsDown[key] = false;
    }
  }
}
