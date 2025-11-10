import Enemy from "./enemy";
import EnemyFire from "./enemyFire";
import Score from './score';
import Particles from "../helpers/particles";

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

    for (let i = 0; i < 7; i += 1) {
      let p = this.pos.copy().add(vec2(rand(-1, 1), rand(-1, 1))),
        s = rand(this.size.x - 1, this.size.x + 1);
      this.g.events.push({
        ttl: i * .2,
        cb: () => {
          Particles.explodeBaddie(p, this.size);
          this.g.sfx.play('explosion', p);
        }
      });
    }

    this.g.events.push({
      ttl: 2.5,
      cb: () => {
        if (this.g.gameOver) return;
        this.g.levelNum += 1;
        this.g.sceneManager.changeScene('LevelComplete');
      }
    })
  }

}
