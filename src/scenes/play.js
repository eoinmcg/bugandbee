import Scene from "./scene";
import Player from "../sprites/player";
import Alert from "../sprites/alert";
import { setItem } from "../helpers/store.js";

import LevelManager from "../helpers/levelManager";

export default class Play extends Scene {

  enter(g) {
    super.enter(g);
    this.g = g;
    this.g.plays += 1;
    setItem('plays', this.g.plays);

    if (g.store.p2.type) {
      inputWASDEmulateDirection = false;
      if (g.store.p1.lives >= 0)
        this.g.p1 = new Player(this.g, vec2(0), 'BUG', 'p1');
      if (g.store.p2.lives >= 0)
        this.g.p2 = new Player(this.g, vec2(0, 2), 'BEE', 'p2');
    } else {
      this.g.p1 = new Player(this.g, vec2(0), this.g.store.p1.type || 'BUG', 'p1');
    }

    this.g.gameOver = false;

    this.yPos = [-5, -7];
    this.pointer = 0;
    this.lastStick = [0];
    this.pausedPointer = 0;

    this.levelManager = new LevelManager(g, this.g.levelNum);

    if (this.g.p1 && this.g.p2) {
      window.setTimeout(() => {
        this.g.medals[0].unlock();
      }, 2000);
    }

  }

  update() {
    super.update();
    this.levelManager.update();

    if (this.g.store.p1.score > this.g.hiScore
      || this.g.store.p2.score > this.g.hiScore) {
      if (!this.g.newHiscore) {
        new Alert(this.g, { text: 'NEW HISCORE!!', col: 'lemon', pos: vec2(0, -5), fontSize: 1.5, sfx: 'score' });
      }
      this.g.newHiscore = true;
      this.g.hiScore = Math.max(this.g.store.p1.score, this.g.store.p2.score);
      this.g.medals[1].unlock();

    }


    const p1Dead = this.g.store.p1.lives < 0;
    const p2Dead = this.g.p2 ? this.g.store.p2.lives < 0 : true;
    const is2PlayerGame = this.g.p2 && this.g.p1 ? true : false;

    this.check2PlayerContinue(p1Dead, p2Dead, is2PlayerGame);

    if (p1Dead && p2Dead && !this.g.gameOver) {
      if (this.g.newHiscore) {
        setItem('HiScore', this.g.hiScore);
      }
      this.g.gameOver = time;
      this.levelManager.setGameOver();
      try {
        this.g.music.pause();
      } catch (e) { }
    }


    if (this.g.gameOver) {
      this.checkGameOverInput();
    }

  }

  updatePost() {
    const pausePressed = keyWasPressed('KeyP') || gamepadWasPressed(9);
    const pauseClicked = mouseWasPressed(0) && mousePos.x > 18 && mousePos.y > 9.5;

    if (!this.g.gameOver && (pausePressed || pauseClicked)) {
      this.togglePause();
    }

    if (!paused) return;

    this.handleUiInput();
    this.pausedPointer = this.clampPointer(this.pausedPointer, this.uiInput);

    const menuConfirmed = this.uiInput === 'enter' && mousePos.x < 19 && mousePos.y < 9.5;
    if (menuConfirmed) {
      this.handlePauseMenuSelection();
    }
  }

  clampPointer(pointer, input) {
    if (input === 'up') pointer--;
    if (input === 'down') pointer++;
    return (pointer + 2) % 2; // wraps between 0 and 1
  }

  handlePauseMenuSelection() {
    const actions = [
      () => this.g.sfx.toggleMute(),
      () => toggleFullscreen(),
    ];
    actions[this.pausedPointer]?.();
  }

  togglePause() {
    paused = !paused;

    if (this.g.sfx.isMuted) return;

    if (paused) {
      this.g.music.pause();
    } else {
      this.g.music.play();
    }
  }

  check2PlayerContinue(p1Dead, p2Dead, is2PlayerGame) {
    if (!is2PlayerGame) return;

    const restore = (player = 'p1') => {

      let text = player === 'p1' ? 'BUG ' : 'BEE ';
      let col = player == 'p1' ? 'white' : 'white';

      new Alert(this.g, { text: text + 'IS BACK', col: col, pos: vec2(0, -5), fontSize: 1.5, sfx: 'respawn' });
      this.g.store[player] = {
        score: 0,
        lives: 2,
        powerups: 0,
        type: text,
      }
    }


    if (p1Dead && !p2Dead
      && (time > this.g.p1.killedAt + 2)
      && (keyWasPressed('Space') || gamepadWasPressed(2, 0))
    ) {
      restore('p1');
      this.g.p1 = new Player(this.g, vec2(0), 'BUG', 'p1');
    }

    if (p2Dead && !p1Dead
      && (time > this.g.p2.killedAt + 2)
      && (keyWasPressed('KeyF') || gamepadWasPressed(2, 1))
    ) {
      restore('p2');
      this.g.p2 = new Player(this.g, vec2(0, 2), 'BEE', 'p2');
    }

  }

  checkGameOverInput() {
    const stick = gamepadStick(0);
    const swipe = this.g.swipe.dir;

    if (keyWasPressed('ArrowUp')
      || swipe === 'up'
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.pointer -= 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();

    }
    if (keyWasPressed('ArrowDown')
      || swipe === 'down'
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.pointer += 1;
      this.g.sfx.play('walk');
      this.g.swipe.clear();
    }
    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    this.lastStick = [stick.y];

    if (time > (this.g.gameOver + 2)) {
      if (keyWasPressed('Space')
        || keyWasPressed('KeyF')
        || keyWasPressed('Enter')
        || swipe === 'tap'
        || gamepadWasPressed(0)
        || gamepadWasPressed(2)) {
        if (this.pointer === 0) {
          let p1Type = this.g.p1.type;
          let p2Type = this.g.p2?.type;
          this.g.resetStore();
          this.g.store.p1.type = p1Type;
          this.g.store.p2.type = p2Type;
          this.g.swipe.clear();

          this.levelManager = new LevelManager(this.g, this.g.levelNum);
          this.g.sceneManager.changeScene('Play');
        } else {
          this.g.sceneManager.changeScene('Splash');
          this.g.swipe.clear();
        }
      }
    }

  }

  render() {
    this.levelManager.render();
  }

  renderPost() {
    const wave = Math.sin(new Date().getTime() * 0.005);
    const font = engineImageFont;

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    const col = this.g.newHiscore ? this.g.palette.lime.mk() : WHITE;
    font.drawText(hi, vec2(0, -11.8), .8, true, BLACK);
    font.drawText(hi, vec2(0, -11.7), .8, true, col);

    const leftX = this.g.widescreen ? -20 : -14;

    const text = this.g.p2 && this.g.p1.destroyed
      ? wave > 0 ? 'PRESS FIRE' : ''
      : `${this.g.p1.type}: ${this.g.store.p1.score.toString().padStart(5, '0')}`;
    font.drawText(text, vec2(leftX, 12), .8, false, BLACK);
    font.drawText(text, vec2(leftX, 11.8), .8, false, WHITE);
    const heartTile = this.g.tile('heart');
    const pink = this.g.palette.pink.mk();
    for (let i = 0; i < this.g.store.p1.lives; i += 1) {
      drawTile(cameraPos.add(vec2(leftX + (i), 10.5)), vec2(.8), heartTile, pink);
    }

    if (this.g.p2) {
      const rightX = this.g.widescreen ? 13 : 6;
      const text = this.g.p2.destroyed
        ? wave > 0 ? 'PRESS FIRE' : ''
        : `${this.g.p2.type}: ${this.g.store.p2.score.toString().padStart(5, '0')}`;

      font.drawText(text, vec2(rightX - .1, 11.8), .8, false, BLACK);
      font.drawText(text, vec2(rightX, 12), .8, false, WHITE);

      for (let i = 0; i < this.g.store.p2.lives; i += 1) {
        drawTile(cameraPos.add(vec2(rightX + (i), 10.5)), vec2(.8), heartTile, pink);
      }
    }

    if (this.g.gameOver) {
      if (wave > 0) {
        font.drawText(`GAME OVER`, vec2(0, .75), 2.5, true, BLACK);
        font.drawText(`GAME OVER`, vec2(0, 1), 2.5, true, RED);
      }
      font.drawText('CONTINUE?', cameraPos.add(vec2(0, -5)), 1.2, true);
      font.drawText('QUIT', cameraPos.add(vec2(0, -7)), 1.2, true);

      drawTile(vec2(-6.5, this.yPos[this.pointer]), vec2(1), this.g.tile('skull'), undefined, 0, true);
    }

    this.renderPaused();

    // hacky. ensure enemyFire appears above explosions
    engineObjects.forEach((o) => {
      if (o.name === 'enemyFire') {
        o.render();
      };
    })

    super.renderPost();

  }

  renderPaused() {
    if (this.g.hitStop) return;

    if (isTouchDevice) {
      const rightX = this.g.widescreen ? 19 : 6;
      drawRect(vec2(rightX + .1, 10.8), vec2(.5, 1.7), BLACK)
      drawRect(vec2(rightX + 1.1, 10.8), vec2(.5, 1.7), BLACK)

      drawRect(vec2(rightX, 11), vec2(.5, 1.7), WHITE)
      drawRect(vec2(rightX + 1, 11), vec2(.5, 1.7), WHITE)
    }

    if (!paused) return;

    const wave = Math.sin(new Date().getTime() * 0.005);
    const font = engineImageFont;

    if (wave > 0) {
      font.drawText(`PAUSED`, vec2(0, .75), 2, true, BLACK);
      font.drawText(`PAUSED`, vec2(0, 1), 2, true, this.g.palette.lime.mk());
    }

    const yPos = -2;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: fullscreen)').matches
      || navigator.standalone === true; // iOS Safari specific

    drawRect(vec2(0, -3), vec2(12, 4), new Color(0, 0, 0, 0.8))
    drawTile(vec2(-5, yPos - this.pausedPointer), vec2(.5), this.g.tile('circle'))
    font.drawText(`MUTE: ${this.g.sfx.isMuted ? 'ON' : 'OFF'}`, vec2(-4, yPos), .6, false, WHITE);
    font.drawText(`FULLSCREEN: ${isInstalled ? 'ON' : 'OFF'}`, vec2(-4, yPos - 1), .6, false, WHITE);

  }
}
