import Sprite from "./sprite";
import Bullet from "./bullet";
import Charge from "./charge";
import Shield from "./shield";
import Particles from "../helpers/particles";
import { outlineTile } from "../helpers/drawOutline";

export default class Player extends Sprite {
  constructor(g, pos, type = 'BEE', player = 'p1') {
    const props = { g, type, player };

    const t = g.tile(type + '0');
    super(pos, vec2(1), t, props);

    this.g = g;
    this.player = player;
    this.name = 'player';

    this.mass = 1;

    this.type = type.toUpperCase() === 'BEE' ? 'BEE' : 'BUG';

    if (this.type === 'BEE') {
      this.anims = {
        fly: ['bee0', 'bee1', 'bee2'],
        up: ['bee0'], down: ['bee2']
      }
    } else {
      this.anims = {
        fly: ['bug0', 'bug1', 'bug2'],
        up: ['bug0'], down: ['bug1']
      }
    }
    this.changeAnim('fly', .1);

    this.hurt = false;
    this.hurtFor = 3;
    this.hurtTimer = new Timer;

    this.charge = 0;

    this.hurtTimer.set(this.hurtFor);
    this.fade = true;

    this.velocity = vec2(0, 0);
    this.renderOrder = 2000;

    this.outline = {
      offset: .15, color: new Color(0, 0, 0, 1)
    }

    // for bouncing of platforms
    this.bounceTimer = 0;
    this.bounceDuration = 0.2;

    // this.children.push(
    //   new Shield(this.g, this.pos, this)
    // );

  }

  update() {

    super.update();

    if (this.bounceTimer > 0) {
      this.bounceTimer -= timeDelta;
    }

    if (this.bounceTimer <= 0) {
      this.velocity = vec2(0, 0);
      this.handleInput();
    }


    this.angle = -this.velocity.y * 2;

    if (this.shootCharge) {
      new Charge(this.g, this.pos,
        this.angle * -.5, this.charge / 10, this.player)
      this.charge = 0;
    } else if (this.shoot) {
      this.g.sfx.play('shoot', this.pos);
      Particles.gunsmoke(this.pos.add(vec2(.5, 0)));
      const bulletProps = {
        g: this.g,
        angle: this.angle * -.5,
        owner: this.player,
        name: 'bullet'
      }
      new Bullet(this.pos, bulletProps);
      this.applyPowerups(bulletProps);
      this.charge = 0;
    }

    this.velocity.y = clamp(this.velocity.y, -.1, .2);
    this.pos.x = clamp(this.pos.x, this.g.size.min.x + .5, this.g.size.max.x - .5);
    this.pos.y = clamp(this.pos.y, this.g.size.min.y + .5, this.g.size.max.y - .5);

    let t = this.hurtTimer.get();
    if (this.hurtTimer && this.hurtTimer.isSet && this.hurtTimer.elapsed()) {
      this.hurtTimer.unset();
      this.fade = false;
    }
    if (t < 0) {
      this.fade = (t * -1) / this.hurtFor;
    }


    if (this.hitPlatform) {
      this.pos.add(vec2(0, -2));
      this.velocity.y = 0;
    }

    this.hitPlatform = false;
  }

  render() {
    const wave = Math.sin(time * 20);
    if (this.fade) {
      let t = this.type === 'BUG' ? 15 : 10;
      drawTile(this.pos, vec2(2 * (this.fade * .9)), tile(t, this.g.tileSize), new Color(1, 1, 1, this.fade * .9));
    }
    if (this.fade && wave > 0) return;

    if (this.charge > 10) {
      outlineTile({
        pos: this.pos.add(vec2(.5, 0)),
        size: vec2(2 * this.charge / 100),
        tileInfo: this.g.tile('circle'),
        color: this.charge === 100 ? WHITE : new Color(1, .7, 0, this.charge / 100),
        angle: -time,
        outlineColor: RED,
        outlineOffset: .2
      });
    }

    if (this.shoot) {
      drawTile(this.pos, vec2(1), tile(7, this.g.tileSize))
    }

    super.render();
  }

  handleInput() {

    const KEYS = {
      p1: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        shoot: 'Space',
        pad: 0,
      },
      p2: {
        up: 'KeyW',
        down: 'KeyS',
        left: 'KeyA',
        right: 'KeyD',
        shoot: 'KeyF',
        pad: 1,
      }
    }

    const K = KEYS[this.player];

    let stick = gamepadStick(K.pad);
    let newAnim = 'fly';

    if (keyIsDown(K.left) || stick.x < 0) this.velocity.x = -.2;
    if (keyIsDown(K.right) || stick.x > 0) this.velocity.x = .2;

    if (keyIsDown(K.up) || stick.y > 0) {
      this.velocity.y = .2;
      newAnim = 'up';
    }
    if (keyIsDown(K.down) || stick.y < 0) {
      this.velocity.y = -.2;
      newAnim = 'down';
    }

    if (keyIsDown(K.shoot) || gamepadIsDown(2, K.pad)) {
      this.charge += 1;
      this.charge = clamp(this.charge, 0, 100);
    }

    this.shoot = keyWasPressed(K.shoot) || gamepadWasPressed(2, K.pad);
    this.shootCharge = ((keyWasReleased(K.shoot) || gamepadWasReleased(2, K.pad)) && this.charge > 80);
    if ((keyWasReleased(K.shoot) || gamepadWasReleased(2, K.pad)) && this.charge < 80) {
      this.charge = 0;
    }
  }

  collideWithObject(o) {
    if (this.fade) return;
    const canHit = ['baddie', 'enemyFire', 'platform', 'rock']
    if (canHit.includes(o.name)) {
      if (o.name !== 'platform' && o.type !== 'boss' && o.name !== 'rock') {
        this.g.store[this.player].score += o.value || 0;
        o.destroy(true);
      } else if (o.name === 'platform' && this.velocity.y < 0) {
        const bounceDir = this.pos.subtract(o.pos).normalize();
        const bounceMagnitude = .5;
        this.velocity = bounceDir.scale(bounceMagnitude);
        this.bounceTimer = this.bounceDuration;
      }
      this.g.store[this.player].lives -= 1;
      this.g.store[this.player].powerups = 0;
      this.g.sfx.play('smash', this.pos);
      Particles.explode(this.pos, .25);
      Particles.sparks(this.pos);

      this.hurtTimer.set(this.hurtFor);
      this.fade = true;

      if (this.g.store[this.player].lives < 0) {
        this.destroy();
        for (let i = 0; i < 8; i += 1) {
          Particles.explode(this.pos.add(vec2(rand(-1, 1))));

        }
        this.g.sfx.play('explosion', this.pos);
        this.g.sfx.play('hurt', this.pos);
      }
    }
  }

  updateStore(k, v) {
    this.g.store[this.player][k] += v;
  }

  getStore(k) {
    return this.g.store[this.player][k];
  }

  applyPowerups(bulletProps) {
    const powerups = this.getStore('powerups');
    if (!powerups) return;

    // props.angle + PI           // behind
    // props.angle + (PI / 12)    // up angle
    // props.angle - (PI / 12)   // down angle
    // props.angle - (PI / 2)     // straight down
    // props.angle + (PI / 2)     // straight up

    let props;
    if (powerups > 0) {
      new Bullet(this.pos.add(vec2(0, -.75)), bulletProps);
    }
    if (powerups > 2) {
      props = { ...bulletProps };
      props.angle = props.angle + (PI / 12);
      new Bullet(this.pos.add(vec2(0, .75)), props);
    }
    if (powerups > 3) {
      props = { ...bulletProps };
      props.angle = props.angle - (PI / 12);
      new Bullet(this.pos.add(vec2(0, .75)), props);
    }
    if (powerups > 4) {
      props = { ...bulletProps };
      props.angle = props.angle + PI;
      new Bullet(this.pos.add(vec2(0, -.5)), props);
    }
  }

}
