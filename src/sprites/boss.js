import Enemy from "./enemy";
import EnemyFire from "./enemyFire";
import Score from './score';

export default class Boss extends Enemy {

  constructor(g, props) {

    super(g, {
      pos: props.pos,
      size: props.size,
      tile: props.tile,
      health: props.health,
      value: props.value,
    });

    this.g = g;

    this.name = 'baddie';
    this.type = 'boss';

    this.outline = {
      color: BLACK, offset: .25
    };


    this.g.bossFight = this;
    this.velocity = vec2(-.2, rand(-.1, .1))

    this.g.stopMusic();
    window.setTimeout(() => {
      this.g.playMusic(6);
    }, 10);

  }

  shoot() {
    const target = this.getRandomPlayer();
    if (!target) return;
    const diff = target.pos.subtract(this.pos);
    const angle = Math.atan2(diff.y, diff.x);
    new EnemyFire(this.g, this.pos, angle, .2);
  }

  destroy(explode) {
    if (this.g.gameOver) return super.destroy(false);
    super.destroy(explode);
    this.g.stopMusic();
    new Score(this.g, { value: this.value, pos: this.pos });

    setTimeout(() => {
      if (this.g.gameOver) return;
      this.g.levelNum += 1;
      this.g.sceneManager.changeScene('LevelComplete');
    }, 2000);
  }

}
