import { levels, waves } from '../data/levelData';
import Game from '../core/game';

import Alert from '../sprites/alert';
import Enemy from '../sprites/enemy';
import Platform from '../sprites/platform';
import Slope from '../sprites/slope';
import Worm from '../sprites/worm';
import Seeker from '../sprites/seeker';
import Spider from '../sprites/spider';
import Shroom from '../sprites/shroom';
import Popcorn from '../sprites/popcorn';
import Spike from '../sprites/spike';
import Rock from '../sprites/rock';
import SkullBoss from '../sprites/skullboss';
import SpiderBoss from '../sprites/spiderboss';
import EyeBoss from '../sprites/eyeboss';

import Meadow from '../bgs/meadow';
import Forest from '../bgs/forest';
import Tunnel from '../bgs/tunnel';
import Underground from '../bgs/underground';

import paths from '../data/paths';

export default class LevelManager {

  constructor(g, levelNum = 1) {
    this.g = g;
    this.levelNum = levelNum;
    this.g.totalLevels = levels.length;

    this.bgs = {
      Meadow, Forest, Tunnel, Underground
    };

    this.ents = {
      worm: Worm,
      spider: Spider,
      shroom: Shroom,
      rock: Rock,
      popcorn: Popcorn,
      seeker: Seeker,
      skullboss: SkullBoss,
      spiderboss: SpiderBoss,
      eyeboss: EyeBoss,
      alert: Alert,
    }
    window.ents = this.ents;

    g.waves = {};
    this.events = [];
    this.loadLevel(levelNum);

  }

  loadLevel(num) {
    this.level = levels[num - 1];
    if (!this.level) {
      this.g.sceneManager.changeScene('Help', 'complete', true);
      return;
    }
    this.bg = new this.bgs[this.level.bg](this.level.sky, this.level.speed[0]);
    this.g.playMusic(this.level.audio);

    this.g.level = {
      // ground speed ALWAYS *-.15
      speed: this.level.speed[0] * -.15,
    }



    this.addPlatforms();

    // this.tunnel = new Tunnel();
    // for tunnel
    this.angleOffset = 0;
    this.noiseSpeed = 0.01; // How fast the tunnel curves
    this.angleRange = 0.1;
    this.downwardBias = 0.05;

    new Alert(this.g, { text: this.level.title, fonts: this.g.fonts });
    new Alert(this.g, { text: `LEVEL: ${this.g.levelNum}`, pos: vec2(0, 1.5), col: 'white', outline: 'black', fontSize: 1.2 });

    for (let phase of this.level.phases) {

      if (!phase.end) {
        this.events.push(({
          ttl: phase.start,
          cb: () => {
            if (phase.types.includes('levelComplete')) {
              this.g.levelNum += 1;
              this.g.sceneManager.changeScene('LevelComplete');
            } else {
              new this.ents[phase.types.rnd()](this.g, phase.props);
            }
          }
        }));
        continue;
      }

      let time = phase.start;
      while (time < phase.end - phase.freq[1]) {
        time = time + rand(phase.freq[0], phase.freq[1]);
        let type = phase.types.rnd();
        let isWave = type.includes('wave.');
        type = type.replace('wave.', '');
        let props = isWave ? waves[type] : {};

        console.log(type, waves[type], waves);

        this.events.push(({
          ttl: time,
          cb: () => {
            if (isWave) {
              this.spawnWave(props);
            } else if (type === 'popcorn') {
              this.spawnPopcornWave();
            } else {
              new this.ents[type](this.g, phase.props);
            }
          }
        }));
      }
    }

  }

  addPlatforms() {

    if (!this.level.platforms) return;

    const types = {
      slope: Slope,
      platform: Platform,
    };
    const type = this.level.sloping ? 'slope' : 'platform';

    let platformW = 5;

    if (this.level.platforms.includes('bottom')) {
      for (let i = -3; i <= 3; i += 1) {
        new types[type](this.g, vec2((i * platformW), -11));
      }
    }
    if (this.level.platforms.includes('top')) {
      for (let i = -3; i <= 3; i += 1) {
        new types[type](this.g, vec2((i * platformW), 14.5), 'top');
      }
    }

    if (this.level.rocks) {
      new Spike(this.g, { pos: vec2(20, -14) });
      new Spike(this.g, { pos: vec2(60, 9) });
    }


  }

  resetLevel() {

  }

  setGameOver() {
    this.g.stopMusic();
    window.setTimeout(() => {
      this.g.playMusic(0);
    }, 1000);
  }

  spawnWave(props = {}) {
    const waveId = new Date().getTime();
    const defaults = {
      pos: vec2(-30, -30),
      health: 2,
      speed: 10,
      waveId: waveId,
      waveNum: 4,
      path: Object.keys(paths).rnd(),
      anim: ['muncher', 'drone', 'skull'].rnd(),
      // reverse: rand() > .5,
      reverse: false,
    }

    props = { ...defaults, ...props };
    this.g.waves[waveId] = props.waveNum;

    for (let i = 0; i < props.waveNum; i += 1) {
      this.events.push({
        ttl: .5 * i, cb: () => {
          new Enemy(Game, props);
        }
      });
    }

  }

  spawnPopcornWave(num = 3) {
    let waveId = new Date().getTime();
    this.g.waves[waveId] = num - 1;
    let pos = vec2(
      rand() > .5 ? Game.size.min.x - 2 : Game.size.max.x + 2,
      rand(-10, 10)
    );
    let spacing = pos.x < 0 ? -3 : 3;
    for (let i = 0; i < num; i += 1) {
      new Popcorn(Game, { pos: pos.add(vec2(i * spacing, 0)), waveId: waveId });
    }
  }

  update() {
    if (!this.level) return;
    this.bg.update();


    if (this.g.levelNum === 3) {

      this.angleOffset += 0.01;
      const noise = (noise1D(this.angleOffset) - 0.5) * 2;
      this.angle = (noise * this.angleRange) + this.downwardBias;
      this.g.angle = this.angle;
    }

    if (!window.BUILD && keyWasPressed('KeyL')) {
      return this.nextLevel();
    }

    if (this.g.bossFight) {
      // console.log(this.g.bossFight)
    }

    if (this.g.gameOver) return;

    for (let i = this.events.length - 1; i >= 0; --i) {
      const e = this.events[i];
      e.ttl -= timeDelta;

      if (e.ttl < 0) {
        e.cb();
        this.events.splice(i, 1);
      }
    }

  }

  render() {
    if (!this.level) return;
    this.bg.render();
  }

  nextLevel() {
    this.g.levelNum += 1;
    this.g.sceneManager.changeScene('LevelComplete');
    try {
      this.g.music.pause();
    } catch (e) { }
  }

}


// Simple 1D noise function
function noise1D(x) {
  const i = Math.floor(x);
  const f = x - i;

  // Hash function for pseudo-random values
  const hash = (n) => {
    n = Math.sin(n) * 43758.5453123;
    return n - Math.floor(n);
  };

  const a = hash(i);
  const b = hash(i + 1);

  // Smooth interpolation
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

