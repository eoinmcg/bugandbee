import Game from "./core/game.js";
import resize from "./helpers/resize.js";
import { tvShader, passthroughShader } from "./lib/tvShader.js";
import Swiper from "./lib/swiper.js";
import { FloatingStick, FireButton } from "./lib/mobileControls.js"
import { isTouchDevice } from "littlejsengine";

function gameInit() {
  resize(Game.W, Game.H);
  canvasMaxSize = vec2(2048);
  canvasMinAspect = 1.6;
  canvasMaxAspect = 2;

  setCanvasPixelated(true);
  Game.sceneManager.changeScene(Game.startScene);

  Game.shaders = { tvShader, passthroughShader };

  const useShader = false;

  if (!isTouchDevice && useShader) {
    new PostProcessPlugin(tvShader);
    postProcess.enabled = false;
  }

  Game.floatingStick = new FloatingStick();
  Game.fireButton = new FireButton();
  Game.floatingStick.mount();
  Game.fireButton.mount();

  Game.swipe = new Swiper();
  Game.swipe.clear();

}

function gameUpdate() {
  Game.sceneManager.update();
}

function gameUpdatePost() {
  Game.sceneManager.updatePost();
}

function gameRender() {
  Game.sceneManager.render();
}

function gameRenderPost() {
  Game.sceneManager.renderPost();
}

const loadingDiv = document.querySelector(".loading");
const progressDiv = document.querySelector(".progress");

function preloadAudio(callback) {
  const trackPaths = Game.trackPaths;
  Game.tracks = [];
  Game.audioLoaded = 0;

  if (!trackPaths.length) {
    if (loadingDiv && loadingDiv.parentNode) {
      loadingDiv.parentNode.removeChild(loadingDiv);
    }
    if (callback) callback();
    return;
  }

  trackPaths.forEach((trackPath, i) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = trackPath;

    audio.addEventListener(
      "canplaythrough",
      () => {
        Game.audioLoaded += 1;
        const progress = (Game.audioLoaded / trackPaths.length) * 100;
        progressDiv.style.width = `${progress}%`;

        if (Game.audioLoaded === trackPaths.length) {
          Game.tracksReady = true;
          if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.parentNode.removeChild(loadingDiv);
          }
          if (callback) callback();
        }
      },
      { once: true },
    ); // Remove listener after firing once

    audio.addEventListener(
      "error",
      (e) => {
        console.error(`Failed to load ${trackPath}:`, e);
        Game.audioLoaded += 1; // Count as loaded to prevent hanging
        const progress = (Game.audioLoaded / trackPaths.length) * 100;
        progressDiv.style.width = `${progress}%`;

        if (Game.audioLoaded === trackPaths.length) {
          if (callback) callback();
        }
      },
      { once: true },
    );

    audio.load();
    Game.tracks[i] = audio;
  });
}

if (window.BUILD) {
  preloadAudio(startGame);
} else {
  preloadAudio(startGame);
}

function startGame() {
  engineInit(
    gameInit,
    gameUpdate,
    gameUpdatePost,
    gameRender,
    gameRenderPost,
    Game.images,
  );
}
