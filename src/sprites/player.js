import Sprite from "./sprite";
import Bullet from "./bullet";
import Charge from "./charge";
import Shield from "./shield";
import DeadPlayer from "./deadPlayer";
import Powerup from "./powerup";
import Particles from "../helpers/particles";
import { outlineTile } from "../helpers/drawOutline";
import isMobile from "../helpers/isMobile";
import postScore from "../helpers/postScore";
import { gamepadWasReleased, isTouchDevice } from "littlejsengine";

export default class Player extends Sprite {
  constructor(g, pos, type = "BEE", player = "p1") {
    const props = { g, type, player };

    const t = g.tile(type + "0");
    super(pos, vec2(1), t, props);

    this.g = g;
    this.player = player;
    this.name = "player";
    this.mirror = false;
    this.canFlipX = false;

    this.mass = 1;

    this.type = type.toUpperCase() === "BEE" ? "BEE" : "BUG";

    if (this.type === "BEE") {
      this.anims = {
        fly: ["bee0", "bee1", "bee2"],
        up: ["bee0"],
        down: ["bee2"],
      };
    } else {
      this.anims = {
        fly: ["bug0", "bug1", "bug2"],
        up: ["bug0"],
        down: ["bug1"],
      };
    }
    this.changeAnim("fly", 0.1);

    this.hurt = false;
    this.hurtFor = 3;
    this.hurtTimer = new Timer();

    this.charge = 0;

    // this.hurtTimer.set(this.hurtFor);
    this.fade = 0;

    this.velocity = vec2(0, 0);
    this.renderOrder = 2000;

    this.outline = {
      offset: 0.15,
      color: new Color(0, 0, 0, 1),
    };

    // for bouncing of platforms
    this.bounceTimer = 0;
    this.bounceDuration = 0.2;

    this.autofire = isMobile();
    this.autofireRate = 10;
    this.autofireCooldown = this.autofireRate;
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

    this.handleRotation();
    this.handleAutofire();
    this.handleShoot();

    this.velocity.y = clamp(this.velocity.y, -0.2, 0.2);
    this.clampToScreen();

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

    if (this.g.playerFlash === this.player) {
      drawTile(this.pos, vec2(2.7), tile(2, this.g.tileSize), WHITE, time);
    }

    if (this.fade) {
      let t = this.type === "BUG" ? 15 : 10;
      let size = (1 - this.fade) * 10;
      let ringColor =
        this.type === "BUG"
          ? new Color(1, 0, 0, this.fade)
          : new Color(1, 1, 0, this.fade);
      drawEllipse(
        this.pos,
        vec2(clamp(size, 1, 3)),
        CLEAR_BLACK,
        0,
        0.3,
        ringColor,
      );
      drawTile(
        this.pos,
        vec2(2 * (this.fade * 0.9)),
        tile(t, this.g.tileSize),
        new Color(1, 1, 1, this.fade * 0.9),
      );
    }
    if (this.fade && wave > 0) return;

    if (this.charge > 10) {
      const direction = this.mirror ? -1 : 1;
      outlineTile({
        pos: this.pos.add(vec2(0.5 * direction, 0)),
        size: vec2((2 * this.charge) / 100),
        tileInfo: this.g.tile("circle"),
        color:
          this.charge === 100 ? WHITE : new Color(1, 0.7, 0, this.charge / 100),
        angle: -time,
        outlineColor: RED,
        outlineOffset: 0.2,
      });
    }

    if (this.shoot) {
      drawTile(this.pos, vec2(1), tile(7, this.g.tileSize));
    }

    super.render();
  }

  handleInput() {
    const KEYS = {
      p1: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        shoot: "Space",
        pad: 0,
      },
      p2: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
        shoot: "KeyF",
        pad: 1,
      },
    };

    let FIREBUTTON = 2;

    const K = KEYS[this.player];

    let stick = gamepadDpad(K.pad);

    // Keyboard
    if (keyIsDown(K.left) || stick.x < 0) {
      this.mirror = !!this.canFlipX; this.velocity.x = -0.2;
    } else if (keyIsDown(K.right) || stick.x > 0) {
      this.mirror = false; this.velocity.x = 0.2;
    } else {
      this.velocity.x = 0;
    }

    if (keyIsDown(K.up) || stick.y > 0) {
      this.velocity.y = 0.2;
    } else if (keyIsDown(K.down) || stick.y < 0) {
      this.velocity.y = -0.2;
    } else {
      this.velocity.y = 0;
    }

    if (isTouchDevice) {
      stick = this.g.floatingStick.value;
      if (stick.x !== 0 || stick.y !== 0) {
        if (stick.x < 0) { this.mirror = !!this.canFlipX; }
        else if (stick.x > 0) { this.mirror = false; }

        const angle = Math.atan2(stick.y, stick.x);
        const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const snapX = Math.round(Math.cos(snapped));
        const snapY = Math.round(Math.sin(snapped));

        this.velocity.x = snapX * 0.2;
        this.velocity.y = snapY * 0.2;
        this.snapY = snapY;
      } else {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.snapY = 0;
      }
    }
    let fireButton = this.g.fireButton;

    const shootPressed = keyIsDown(K.shoot)
      || (isTouchDevice ? fireButton.isDown : gamepadIsDown(FIREBUTTON, K.pad));
    const shootJustPressed = keyWasPressed(K.shoot)
      || (isTouchDevice ? fireButton.wasPressed : gamepadWasPressed(FIREBUTTON, K.pad));
    let shootReleased = keyWasReleased(K.shoot)
      || (isTouchDevice ? fireButton.wasReleased : gamepadWasReleased(FIREBUTTON, K.pad));

    if (!shootPressed) {
      shootReleased = true;
    }

    if (shootJustPressed) {
      this.charge = 0;
    }

    if (shootPressed) {
      this.charge = Math.min(this.charge + 1, 100);
    }

    this.shoot = shootJustPressed;
    this.shootCharge = shootReleased && this.charge >= 80;

    if (shootReleased) {
      this.charge = 0;
    }
  }

  handleAutofire() {
    if (!this.autofire || this.charge > 0) {
      return;
    }
    this.autofireCooldown -= 1;
    if (this.autofireCooldown < 0) {
      this.autofireCooldown = this.autofireRate;
      this.shoot = true;
    }
  }

  handleRotation() {
    const maxAngle = 0.5;
    const angleStep = 0.05;
    const direction = this.mirror ? -1 : 1;
    const verticalInput = isTouchDevice ? this.snapY : Math.sign(this.velocity.y);

    if (verticalInput !== 0) {
      this.angle += (verticalInput > 0 ? -angleStep : angleStep) * direction;
    } else if (this.angle !== 0) {
      this.angle += this.angle > 0 ? -angleStep : angleStep;
    }

    this.angle = clamp(this.angle, -maxAngle, maxAngle);
  }
  handleShoot() {
    const direction = (this.mirror) ? 1 : -1;
    if (this.shootCharge) {
      let chargeAngle = this.angle * (0.5 * direction);
      new Charge(this.g, this.pos, chargeAngle, 10, this.mirror, this.player);
      this.charge = 0;
    } else if (this.shoot) {
      this.g.sfx.play("shoot", this.pos);
      Particles.gunsmoke(this.pos.add(vec2(-0.65 * direction, 0)));
      const bulletProps = {
        g: this.g,
        angle: this.angle * (0.5 * direction),
        mirror: this.mirror ?? false,
        owner: this.player,
        name: "bullet",
      };
      new Bullet(this.pos, bulletProps);
      this.applyPowerups(bulletProps);
      this.charge = 0;
    }
  }

  clampToScreen() {
    this.pos.x = clamp(
      this.pos.x,
      this.g.size.min.x + 0.5,
      this.g.size.max.x - 0.5,
    );
    this.pos.y = clamp(
      this.pos.y,
      this.g.size.min.y + 0.5,
      this.g.size.max.y - 0.5,
    );

  }

  collideWithObject(o) {
    if (this.fade) return;
    const canHit = ["baddie", "enemyFire", "platform", "rock"];
    if (canHit.includes(o.name)) {
      if (o.name !== "platform" && o.type !== "boss" && o.name !== "rock") {
        this.g.store[this.player].score += o.value || 0;
        o.destroy(true);
      } else if (o.name === "platform" && this.velocity.y < 0) {
        const bounceDir = this.pos.subtract(o.pos).normalize();
        const bounceMagnitude = 0.5;
        this.velocity = bounceDir.scale(bounceMagnitude);
        this.bounceTimer = this.bounceDuration;
      }

      let powerups = this.g.store[this.player].powerups;

      this.g.store[this.player].lives -= 1;
      this.g.store[this.player].powerups = 0;
      this.g.sfx.play("smash", this.pos);
      Particles.explode(this.pos, 0.25);
      Particles.sparks(this.pos);
      this.killedAt = time;

      this.hurtTimer.set(this.hurtFor);
      this.fade = 1;

      this.g.sfx.play("hurt", this.pos);
      setPaused(true);
      this.children.forEach((c) => {
        c.destroy();
      });

      this.g.playerFlash = this.player;
      this.hitStop(() => {
        const startAngle = PI / 1.3;
        this.g.playerFlash = false;
        for (let i = 0; i < powerups; i++) {
          const angle = startAngle + (PI * 2 * i) / powerups;
          new Powerup(this.g, this.pos, angle);
        }
      });

      if (this.g.store[this.player].lives < 0) {
        postScore(this.g.store[this.player].score, this.g);
        this.destroy();
        for (let i = 0; i < 4; i += 1) {
          this.g.events.push({
            ttl: i * 0.2,
            cb: () => {
              Particles.explode(this.pos.add(vec2(rand(-1, 1))), rand(1, 2));
              this.g.sfx.play("explosion", this.pos);
            },
          });
        }
        new DeadPlayer(this.g, this.pos, this.type);
        this.g.sfx.play("explosion", this.pos);
        this.g.sfx.play("hurt", this.pos);
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
    const powerups = this.getStore("powerups");
    if (!powerups) return;

    let props;
    if (powerups > 0) {
      new Bullet(this.pos.add(vec2(0, -0.75)), bulletProps);
    }
    if (powerups > 2) {
      props = { ...bulletProps };
      props.angle = props.angle + PI / 12;
      new Bullet(this.pos.add(vec2(0, 0.75)), props);
    }
    if (powerups > 3) {
      props = { ...bulletProps };
      props.angle = props.angle - PI / 12;
      new Bullet(this.pos.add(vec2(0, 0.75)), props);
    }
    if (powerups > 4) {
      props = { ...bulletProps };
      props.angle = props.angle + PI;
      new Bullet(this.pos.add(vec2(0, -0.5)), props);
    }
    if (powerups > 5 && this.children.length === 0) {
      this.children.push(new Shield(this.g, this.pos, this));
    }
    if (powerups > 5) {
      this.g.medals[2].unlock();
    }
  }
}
