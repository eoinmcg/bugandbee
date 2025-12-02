import { outlineTile } from '../helpers/drawOutline';
import Powerup from '../sprites/powerup';
import Scene from './scene';

export default class Tutorial extends Scene {
  enter(Game) {
    this.g = Game;

    this.initTunnel('maroon', 'red', 0.05, .07);
    this.enemies = ['worm0', 'skull', 'eye', 'bat0', 'drone0', 'creep0']
    this.changeEnemy = 0;
    this.enemySprite = this.enemies.rnd();

    this.sfxs = ['smash', 'key', 'jet', 'score'];

    this.step = 0;
    this.title = 'Tutorial';
    this.titleTyped = '';
    this.titleTimer = new Timer();
    this.typeSpeed = .1;
    this.titleTimer.set(this.typeSpeed);

    this.timer = new Timer();
    this.interval = 2;
    this.timer.set(this.interval);

    this.powerup = new Powerup(this.g, vec2(-11, -20));

  }

  update() {

    if (this.titleTimer.elapsed() && this.titleTyped !== this.title) {
      this.titleTyped += this.title.charAt(this.titleTyped.length);
      this.g.sfx.play('score');
      this.titleTimer.set(this.typeSpeed);
    }

    if (this.timer.elapsed() && this.step < 4) {

      this.g.sfx.play(this.sfxs[this.step]);
      this.timer.set(this.interval);
      this.step += 1;
    }


    this.changeEnemy += timeDelta * .5;
    if (this.changeEnemy > 1) {
      this.changeEnemy = 0;
      this.enemySprite = this.enemies.rnd();
    }
    this.charge = this.changeEnemy * 100;

    if (keyWasPressed('Enter')
      || keyWasPressed('KeyX')
      || gamepadWasPressed(0)
      || gamepadWasPressed(1)
      || gamepadWasPressed(2)
      || keyWasPressed('Space')) {
      if (this.step < 3) return;
      this.g.sceneManager.changeScene('Play');
    }


  }

  render() {

    const wave = Math.sin(new Date().getTime() * 0.009);
    setFontDefault('"04b_19"');
    drawTextOverlay(this.titleTyped, vec2(-3, 11), 2, WHITE, 0, WHITE, 'left');

    let startX = -11;

    if (this.step > 0) {
      outlineTile({ pos: vec2(startX, 5), size: vec2(1.5), tileInfo: this.g.tile(this.enemySprite) });
      this.g.fonts['white']
        .drawText('Shoot baddies', vec2(startX + 2, 5), .13, false);
    }

    if (this.step > 1) {
      this.powerup.pos = vec2(-11, 2);
      this.powerup.render();

      // outlineTile({ pos: vec2(startX, 2), size: vec2(1.7), tileInfo: this.g.tile('circle'), color: YELLOW });
      // drawTile(vec2(startX, 2), vec2(1), this.g.tile('smiley'), BLACK);
      this.g.fonts['white']
        .drawText('Collect powerups', vec2(startX + 2, 2), .13, false);

    }

    if (this.step > 2) {
      outlineTile({
        pos: vec2(startX, -1),
        size: vec2(2 * this.charge / 100),
        tileInfo: this.g.tile('circle'),
        color: this.charge > 80 ? WHITE : new Color(1, .7, 0, this.charge / 100),
        angle: -time,
        outlineColor: RED,
        outlineOffset: .2
      });
      this.g.fonts['white']
        .drawText('Hold fire for Mega Shot', vec2(startX + 2, -1), .13, false);
    }

    if (this.step > 3 && wave > 0) {
      this.g.fonts['pink']
        .drawText('Now go kick some butt!', vec2(2, -10), .13, true);
    }

  }

}
