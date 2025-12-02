import Scene from "./scene";
import Player from "../sprites/player";
import Alert from "../sprites/alert";
import { setItem } from "../helpers/store.js";

import LevelManager from "../helpers/levelManager";

export default class Play extends Scene {

  enter(g, data) {
    this.g = g;
    this.g.plays += 1;
    setItem('plays', this.g.plays);

    if (g.store.p2.type) {
      inputWASDEmulateDirection = false;
      this.g.p1 = new Player(this.g, vec2(0), 'BUG', 'p1');
      this.g.p2 = new Player(this.g, vec2(0, 2), 'BEE', 'p2');
    } else {
      this.g.p1 = new Player(this.g, vec2(0), this.g.store.p1.type || 'BUG', 'p1');
    }

    this.g.gameOver = false;

    this.yPos = [-5, -7];
    this.pointer = 0;
    this.lastStick = [0];

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
    if (!this.g.gameOver && (keyWasPressed('KeyP') || gamepadWasPressed(9))) {
      console.log('pause');
      paused = !paused;
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
        powerups: 0
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

    if (keyWasPressed('ArrowUp')
      || (this.lastStick[0] > 0 && stick.y === 0)) {
      this.pointer -= 1;
      this.g.sfx.play('walk');
    }
    if (keyWasPressed('ArrowDown')
      || (this.lastStick[0] < 0 && stick.y === 0)) {
      this.pointer += 1;
      this.g.sfx.play('walk');
    }
    if (this.pointer < 0) this.pointer = this.yPos.length - 1;
    if (this.pointer > this.yPos.length - 1) this.pointer = 0;

    this.lastStick = [stick.y];

    if (time > (this.g.gameOver + 2)) {
      if (keyWasPressed('Space')
        || keyWasPressed('KeyF')
        || keyWasPressed('Enter')
        || gamepadWasPressed(0)
        || gamepadWasPressed(2)) {
        if (this.pointer === 0) {
          let p1Type = this.g.p1.type;
          let p2Type = this.g.p2?.type;
          this.g.resetStore();
          this.g.store.p1.type = p1Type;
          this.g.store.p2.type = p2Type;

          this.levelManager = new LevelManager(this.g, this.g.levelNum);
          this.g.sceneManager.changeScene('Play');
        } else {
          this.g.sceneManager.changeScene('Splash');
        }
      }
    }

  }

  render() {
    this.levelManager.render();
  }

  renderPost() {
    const wave = Math.sin(new Date().getTime() * 0.005);

    const hi = `HI: ${this.g.hiScore.toString().padStart(5, '0')}`;
    const col = this.g.newHiscore ? 'lime' : 'white';
    this.g.fonts.black.drawTextOverlay(hi, cameraPos.add(vec2(0, -11.65)), .1, true);
    this.g.fonts[col].drawTextOverlay(hi, cameraPos.add(vec2(0, -11.5)), .1, true);


    const text = this.g.p2 && this.g.p1.destroyed
      ? wave > 0 ? 'PRESS FIRE' : ''
      : `${this.g.p1.type}: ${this.g.store.p1.score.toString().padStart(5, '0')}`;
    this.g.fonts.black.drawTextOverlay(text, cameraPos.add(vec2(-13.9, 11.9)), .1, false);
    this.g.fonts.white.drawTextOverlay(text, cameraPos.add(vec2(-14, 12)), .1, false);
    const heartTile = this.g.tile('heart');
    const pink = this.g.palette.pink.mk();
    for (let i = 0; i < this.g.store.p1.lives; i += 1) {
      drawTile(cameraPos.add(vec2(-13.5 + (i), 10.5)), vec2(.8), heartTile, pink);
    }

    if (this.g.p2) {
      const text = this.g.p2.destroyed
        ? wave > 0 ? 'PRESS FIRE' : ''
        : `${this.g.p2.type}: ${this.g.store.p2.score.toString().padStart(5, '0')}`;

      this.g.fonts.black.drawTextOverlay(text, cameraPos.add(vec2(5.8, 11.8)), .1, false);
      this.g.fonts.white.drawTextOverlay(text, cameraPos.add(vec2(6, 12)), .1, false);

      for (let i = 0; i < this.g.store.p2.lives; i += 1) {
        drawTile(cameraPos.add(vec2(6.5 + (i), 10.5)), vec2(.8), heartTile, pink);
      }
    }

    if (this.g.gameOver) {
      if (wave > 0) {
        this.g.fonts.black.drawTextOverlay(`GAME OVER`, cameraPos.add(vec2(0, .75)), .25, true);
        this.g.fonts.red.drawTextOverlay(`GAME OVER`, cameraPos.add(vec2(0, 1)), .25, true);
      }
      this.g.fonts.white.drawTextOverlay('CONTINUE?', cameraPos.add(vec2(0, -5)), .15, true);
      this.g.fonts.white.drawTextOverlay('QUIT', cameraPos.add(vec2(0, -7)), .15, true);

      drawTile(vec2(-6, this.yPos[this.pointer] - .3), vec2(1), this.g.tile('skull'), undefined, 0, true);
    }

    if (wave > 0 && paused && !this.g.hitStop) {
      this.g.fonts.black.drawTextOverlay(`PAUSED`, cameraPos.add(vec2(0, .75)), .2, true);
      this.g.fonts.lime.drawTextOverlay(`PAUSED`, cameraPos.add(vec2(0, 1)), .2, true);
    }

    // hacky. ensure enemyFire appears above explosions
    engineObjects.forEach((o) => {
      if (o.name === 'enemyFire') {
        o.render();
      };
    })

  }
}
