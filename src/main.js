import Game from "./core/game.js";
import resize from "./helpers/resize.js";

function gameInit() {
  resize(Game.W, Game.H);
  setCanvasPixelated(true);
  Game.sceneManager.changeScene(Game.startScene);
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

const loadingDiv = document.querySelector('.loading');
const progressDiv = document.querySelector('.progress');

// function preloadAudio(callback) {
//   // CLEAN UP OLD AUDIO FIRST
//   // AGGRESSIVE CLEANUP
//   console.log('PRE-CLEANUP');
//   if (Game.tracks && Game.tracks.length) {
//     console.log('CLEANUP');
//     Game.tracks.forEach(track => {
//       console.log('CLEAN TrACK', track);
//       if (track) {
//         // Stop any playing audio
//         if (track.source) {
//           try {
//             track.source.stop();
//             track.source.disconnect();
//           } catch (e) { }
//           track.source = null;
//         }
//
//         // Clear the audio buffer (this is key!)
//         if (track.buffer) {
//           track.buffer = null;
//         }
//
//         // If there's an Audio element
//         if (track.audio) {
//           track.audio.pause();
//           track.audio.src = '';
//           track.audio.load(); // Force release
//           track.audio = null;
//         }
//
//         // Clear any other references
//         // track.sound = null;
//       }
//     });
//   }
//
//   // Clear the array
//   // Game.tracks = [];
//
//   // Force garbage collection hint (doesn't guarantee but helps)
//   if (window.gc) window.gc();
//   const trackPaths = [...Game.tracks];
//   Game.tracks = [];
//   Game.audioLoaded = 0;
//
//   if (!trackPaths.length) {
//     loadingDiv.parentNode.removeChild(loadingDiv);
//     if (callback) { callback(); }
//   }
//
//   trackPaths.forEach((trackPath, i) => {
//     Game.tracks[i] = new SoundWave(trackPath, 0, undefined, undefined, () => {
//       Game.audioLoaded += 1;
//       let progress = (Game.audioLoaded / trackPaths.length) * 100;
//       progressDiv.style.width = `${progress}%`;
//
//       if (Game.audioLoaded === trackPaths.length) {
//         Game.tracksReady = true;
//
//         if (loadingDiv && loadingDiv.parentNode) {
//           loadingDiv.parentNode.removeChild(loadingDiv);
//         }
//
//         if (callback) {
//           callback();
//         }
//       }
//     });
//   });
// }


// function preloadAudio(callback) {
//   // Clean up old SoundWave instances
//   console.log('OK?', Game.tracks, Game.trackPaths, Game);
//   if (Game.tracks && Game.tracks.length) {
//     Game.tracks.forEach(track => {
//       if (track && track.source) {
//         try {
//           track.source.stop();
//           track.source.disconnect();
//         } catch (e) { }
//       }
//     });
//   }
//
//   // Clear the array
//   Game.tracks = [];
//   Game.audioLoaded = 0;
//
//   // Use the ORIGINAL paths, not the SoundWave objects
//   const trackPaths = Game.trackPaths; // <-- This is the key change!
//
//   if (!trackPaths.length) {
//     if (loadingDiv && loadingDiv.parentNode) {
//       loadingDiv.parentNode.removeChild(loadingDiv);
//     }
//     if (callback) { callback(); }
//     return;
//   }
//
//   trackPaths.forEach((trackPath, i) => {
//     // Add cache-busting parameter in dev
//     const path = trackPath + '?t=' + Date.now();
//     Game.tracks[i] = new Audio(path);
//
//     // Game.tracks[i] = new SoundWave(path, 0, undefined, undefined, () => {
//     //   Game.audioLoaded += 1;
//     //   let progress = (Game.audioLoaded / trackPaths.length) * 100;
//     //   progressDiv.style.width = `${progress}%`;
//     //   if (Game.audioLoaded === trackPaths.length) {
//     //     Game.tracksReady = true;
//     //     if (loadingDiv && loadingDiv.parentNode) {
//     //       loadingDiv.parentNode.removeChild(loadingDiv);
//     //     }
//     //     if (callback) {
//     //       callback();
//     //     }
//     //   }
//     // });
//   });
//   window.setTimeout(() => {
//     loadingDiv.parentNode.removeChild(loadingDiv);
//     callback();
//   }, 1000);
// }
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
    audio.preload = 'auto';
    audio.src = trackPath;

    audio.addEventListener('canplaythrough', () => {
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
    }, { once: true }); // Remove listener after firing once

    audio.addEventListener('error', (e) => {
      console.error(`Failed to load ${trackPath}:`, e);
      Game.audioLoaded += 1; // Count as loaded to prevent hanging
      const progress = (Game.audioLoaded / trackPaths.length) * 100;
      progressDiv.style.width = `${progress}%`;

      if (Game.audioLoaded === trackPaths.length) {
        if (callback) callback();
      }
    }, { once: true });

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
    Game.images
  );
}
