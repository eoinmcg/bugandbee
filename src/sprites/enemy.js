import Sprite from "./sprite";
import Particles from "../helpers/particles";
import EnemyFire from "./enemyFire";
import Powerup from './powerup';
import Score from './score';
import { followPath } from '../helpers/followPath'
import paths from '../data/paths';

export default class Enemy extends Sprite {

  constructor(g, props = {}) {

    super(props.pos, props.size || vec2(1), props.tile || g.tile('eye'));

    Object.assign(this, props);

    this.g = g;
    this.hit = false;
    this.name = 'baddie';
    this.health = this.health || 1;
    this.value = this.value || 10;
    this.outline = this.outline || {
      color: BLACK, offset: .15
    };

    this.anims = {
      creep: ['creep0', 'creep1'],
      drone: ['drone0', 'drone1'],
      muncher: ['bitey0', 'bitey1'],
      flappy: ['flappy0', 'flappy1'],
      bat: ['bat0', 'bat1'],
      skull: ['skull'],
      eye: ['eye'],
    }

    if (this.anim) {
      this.changeAnim(this.anim, .1);
    }

    if (this.path || this.pathOveride) {
      this.pathPoints = this.pathOveride
        ? this.pathOveride : paths[props.path];

      if (this.reverse) {
        this.pathPoints = this.pathPoints
          .map(v => vec2(v.x, -v.y))  // Flip Y
          .reverse();
      }
    }

    this.shots = 0;
    if (this.canShoot && rand() < this.canShoot) {
      this.shots = 1;
    }

  }

  update() {
    super.update();

    if (this.hurt > 0) {
      this.hurt -= timeDelta * 20;
      this.color = new Color(1, 0, 0, this.hurt / 10)
    } else {
      this.color = undefined;
    }

    if (this.pathPoints) {
      followPath(this, timeDelta, this.motion || 'linear');
      this.mirror = this.pos.x > this.lastPos.x;
    }

    if (this.hit && rand() > .7) {
      Particles.damage(this.pos, 1);
    }

    if (this.shots && this.canShoot && rand() > .5) {
      this.shots = 0;
      this.shoot();
    }

  }

  collideWithObject(o) {
    this.multiplier = 1; // charge doubles this
    if (o.name === 'charge' || o.name === 'bullet') {

      this.health -= 1;
      this.hit = true;

      if (o.name === 'bullet') {
        o.destroy();
      }
      if (o.name === 'charge') {
        this.health -= 2;
        this.multiplier = 2;
      }
      if (o.name === 'charge' && this.type === 'boss') {
        o.destroy();
      }

      Particles.sparks(this.pos);

      this.g.sfx.play('walk', this.pos);
      this.pos.x += .5;
      this.hurt = 10;
      this.angle += rand(-.1, .1);
    }

    if (o.name === 'shield' && this.type !== 'boss') {
      this.destroy();
      return;
    }

    const waveId = this?.waveId;
    if (!this.dead && (this.health <= 0 || o.name === 'charge')) {

      if (o.name === 'bullet' || o.name === 'charge') {
        this.value *= this.multiplier;
        this.g.store[o.owner].score += this.value;
      }

      if (this.health <= 0) {
        if (waveId) {
          this.g.waves[waveId] -= 1;
        }

        if (waveId && this.g.waves[waveId] <= 0 && o?.owner) {
          this.g.store[o.owner].score += this.value * 2;
          delete this.g.waves[waveId];
          if (Math.random() > .6) {
            new Powerup(this.g, this.lastPos);
          }
        }

        this.destroy();
      }
    }
  }


  destroy(explode = true) {
    this.dead = true; // prevent double counting
    super.destroy();

    if (!explode) return;
    new Score(this.g, { value: this.value, pos: this.pos });
    Particles.explodeBaddie(this.pos, this.size);
    this.g.sfx.play('explosion', this.pos);
  }

  remove() {
    this.destroy(false);
  }

  getPlayers() {

    const players = [this.g.p1];
    if (this.g.p2) {
      players.push(this.g.p2);
    }

    return players;
  }

  getRandomPlayer() {
    return this.getPlayers().rnd();
  }

  shoot() {
    let player = this.getRandomPlayer();
    if (!player) return;
    const diff = player.pos.subtract(this.pos);
    const angle = Math.atan2(diff.y, diff.x);
    const speed = this.shotSpeed || .1;
    new EnemyFire(this.g, this.pos, angle, speed);
  }
}

