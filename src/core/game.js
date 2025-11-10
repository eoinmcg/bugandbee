import Config from '../data/config.js';
import SceneManager from "./sceneManager.js";

import palette from "../data/palette.js";
import Sfx from "../data/sfx.js";

import colorFont from "../helpers/colorFont.js";
import { getItem } from "../helpers/store.js";

import { newgroundsInit } from "../lib/newgrounds.js";
import keys from "../data/keys.js";

import generateMedals from "../data/medals.js";
let newgrounds = newgroundsInit(keys.AppID, keys.EncryptionKey);


export const Game = {
  title: Config.title,
  W: Config.W,
  H: Config.H,
  sfx: new Sfx(),
  palette: palette,
  plays: 0,
  p1: null,
  p2: null,
  gameOver: false,
  level: null,
  levelNum: 1,
  startScene: 'Splash',
  images: Config.images,
  hiScore: getItem('HiScore', 500),
  newHiscore: false,
  tileSize: Config.tileSize,
  trackPaths: Config.trackPaths,
  tracks: Config.tracks,
  playMusic: (track) => {
    if (Game.music) {
      Game.music.pause();
      Game.music.currentTime = 0;
    }

    if (!Game.tracks[track]) {
      console.warn(`Track ${track} not found`);
      return;
    }

    Game.music = Game.tracks[track];
    // track 0 - start jingle
    // track 1 - die jingle
    if (track > 1) {
      Game.music.loop = true;
    }
    Game.music.volume = 0.7;

    Game.music.play().catch(e => {
      console.warn('Failed to play music:', e);
    });
  },
  stopMusic: () => {
    if (!Game.music) return;
    Game.music.pause();
  },
  toggleMusic: () => {
    if (!Game.music) return;

    if (Game.music.paused) {
      Game.music.play().catch(e => console.warn('Failed to resume music:', e));
    } else {
      Game.music.pause();
    }
  },
  size: Config.size,
  atlas: Config.atlas,
  tile: (n, size, sheet = 0) => {
    return tile(Game.atlas[n], size || Game.tileSize, sheet)

  },
  tracksReady: false,
  isNewgrounds: window.location.hostname === 'uploads.ungrounded.net',
  // scoreboard: scoreboard.result.data.scores,
  ng: newgrounds,
  store: {},
  resetStore: () => {
    Game.newHiscore = false;
    Game.store.p1 = {
      score: 0,
      lives: 2,
      powerups: 0
    }
    Game.store.p2 = {
      score: 0,
      lives: 2,
      powerups: 0
    }
  }
};


document.title = Game.title
Game.resetStore();

let font = new FontImage;
font.image.onload = () => {
  let cols = ['white', 'gray', 'red', 'black', 'yellow', 'green', 'pink', 'orange', 'aqua', 'lime'];
  Game.fonts = {};
  cols.forEach((col) => {
    let image = colorFont(palette[col].hex, font.image);
    Game.fonts[col] = new FontImage(image);
  });
}

Game.medals = generateMedals(Game.title, Game);

const sceneManager = new SceneManager(Game);
Game.sceneManager = sceneManager;

tileFixBleedScale = .1;
// touchInputInit();
touchGamepadEnable = true;
setCanvasClearColor(new Color(0, 0, 0, 0));

if (window.BUILD) {
  setShowWatermark(false);
  setShowSplashScreen(true);
  window.setTimeout(() => {
    console.log(`Build: ${BUILD}\n\n`);
    console.log(`🐞🐝 ${Game.title} say HAI!`);
    console.log(`Check the source: https://github.com/eoinmcg/bugandbee`);
    console.log(`code & GFX by @eoinmcg`);
    console.log(`music: https://not-jam.itch.io/not-jam-music-pack`);
    console.log(`made with: https://github.com/KilledByAPixel/LittleJS`);
  }, 1000)
} else {
  window.G = Game;
  window.NG = newgrounds;
  const params = Object.fromEntries(new URLSearchParams(location.search))
  if (params.l) {
    Game.levelNum = parseInt(params.l, 10);
    Game.lives = 2;
    Game.startScene = 'Play';
  }
  if (params.s) {
    Game.startScene = params.s.charAt(0)
      .toUpperCase()
      + params.s.slice(1);
  }
}

export default Game;

// naughty, naughty
Array.prototype.rnd = function () {
  return this[Math.floor((Math.random() * this.length))];
}
