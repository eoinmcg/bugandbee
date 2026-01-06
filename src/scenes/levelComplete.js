import Scene from "./scene";

export default class LevelComplete extends Scene {

  enter(Game, data) {
    this.g = Game;
    this.ttl = 2;
    this.startTime = time;
    this.g.stopMusic();

    this.p1 = this.g.p1 && this.g.store.p1.lives > -1 ? this.g.p1 : null;
    this.p2 = this.g.p2 && this.g.store.p2.lives > -1 ? this.g.p2 : null;

    this.bonus = 1000;
    this.displayBonus = 0;

    this.nextScene = 'Play';
    if (this.g.levelNum > this.g.totalLevels) {
      console.log('GAME COMPLETE, CHAMP!');
      this.nextScene = 'Victory';
    }

    this.initTunnel('emerald', 'dark_teal', 0.01, .09);
  }

  update() {
    this.ttl -= timeDelta;

    if (this.displayBonus >= this.bonus) {
      this.displayBonus = this.bonus;
    } else {
      if (rand() > .75) {
        this.g.sfx.play('score');
      }
      this.displayBonus += 20;
    }

    if (keyWasPressed('Space')
      || keyWasPressed('KeyF')
      || keyWasPressed('Enter')
      || gamepadWasPressed(2, 0)
      || gamepadWasPressed(2, 1)) {

      this.g.sceneManager.changeScene(this.nextScene);

      if (this.p1) { this.g.store.p1.score += this.bonus; }
      if (this.p2) { this.g.store.p2.score += this.bonus; }

    }

    if (time - this.startTime > 7) {
      this.g.sceneManager.changeScene(this.nextScene);
    }
  }

  renderPost() {

    const font = engineFontImage;

    const w = mainCanvas.width / cameraScale;
    const h = mainCanvas.height / cameraScale;
    drawRect(vec2(0, 0), vec2(w, h), new Color(0, 0, 0, 0.9));

    font.drawText(`LEVEL COMPLETE!`, vec2(0, 10), 1.5, true);

    const bonus = `+${this.displayBonus}`;
    let col = ['lime', 'pink', 'yellow', 'orange', 'aqua'].rnd();
    col = this.g.palette['pink'].mk();

    if (this.p1) {
      let p1Tile = (this.g.p1.type === 'BEE') ? 10 : 15;
      font.drawText(`BONUS`, cameraPos.add(vec2(-7, -2)), 1.2, true);
      font.drawText(bonus, cameraPos.add(vec2(-7, -4)), 1, true, col);
      drawTile(vec2(-7, 1), vec2(2), tile(p1Tile, this.g.tileSize));
    }

    if (this.p2) {
      let p2Tile = (this.g.p2.type === 'BEE') ? 10 : 15;
      font.drawText(`BONUS`, cameraPos.add(vec2(7, -2)), 1.2, true);
      font.drawText(bonus, cameraPos.add(vec2(7, -4)), 1, true, col);
      drawTile(vec2(7, 1), vec2(2), tile(p2Tile, this.g.tileSize));
    }

  }

}
