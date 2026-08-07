import Boss from './boss';
import Particles from "../helpers/particles";

export default class FishBoss extends Boss {

  constructor(g, props = {}) {

    // Ground/water spawn level near bottom of screen
    const bottomY = g.size.min.y + 2;

    super(g, {
      pos: vec2(g.size.min.x, bottomY),
      size: vec2(4),
      tile: g.tile('fish0'),
      health: 60,
      value: 300,
    });

    this.anims = {
      swim: ['fish1', 'fish1'],
      jump: ['fish0'],
    };
    this.changeAnim('swim', .2);

    this.g.stopMusic();
    window.setTimeout(() => {
      this.g.playMusic(6);
    }, 10);

    this.state = 'patrol'; // 'patrol' or 'jump'
    this.patrolSpeed = 0.15;
    this.direction = 1; // 1 = right, -1 = left
    this.gravity = 0.008; // Downward physics acceleration during jump

    // Timers
    this.jumpTimer = new Timer(rand(3, 5));
    this.changeDirectionTimer = new Timer(rand(1, 3));
  }

  update() {
    super.update();

    const size = this.g.size;
    const half = this.size.x / 2;
    const minX = size.min.x + half;
    const maxX = size.max.x - half;

    // Water surface / bottom patrol level near bottom of screen
    const bottomY = size.min.y + 2;

    // --- STATE 1: PATROL (Swimming along the bottom) ---
    if (this.state === 'patrol') {
      this.changeAnim('swim', .2);

      this.velocity.x = this.direction * this.patrolSpeed;
      this.velocity.y = 0;
      this.mirror = this.direction > 0;

      // Smoothly hover at bottom level
      if (Math.abs(this.pos.y - bottomY) > 0.1) {
        this.pos.y += (bottomY - this.pos.y) * 0.1;
      }

      // Bounce off screen boundaries
      if (this.pos.x >= maxX) {
        this.direction = -1;
        this.pos.x = maxX;
      } else if (this.pos.x <= minX) {
        this.direction = 1;
        this.pos.x = minX;
      }

      // Random direction changes
      if (this.changeDirectionTimer.elapsed()) {
        if (rand() > 0.5) {
          this.direction *= -1;
        }
        this.changeDirectionTimer.set(rand(1, 3));
      }

      // Trigger Jump Phase
      if (this.jumpTimer.elapsed()) {
        this.state = 'jump';
        this.changeAnim('jump');
        this.g.sfx.play('splash', this.pos);
        Particles.swampSplash(this.pos, .4)

        // Calculate parabolic launch toward player position
        let player = this.getRandomPlayer();

        if (player) {
          const diff = player.pos.subtract(this.pos);

          // Target arc peak height well above the player
          const arcHeight = Math.max(diff.y, 0) + 6;

          // Solve for initial vertical launch velocity
          const vy = Math.sqrt(2 * this.gravity * arcHeight);

          // Solve air time: ascent + descent back to bottom level
          const tApex = vy / this.gravity;
          const fallDistance = arcHeight - diff.y;
          const tFall = Math.sqrt((2 * Math.max(fallDistance, 1)) / this.gravity);
          const totalTime = tApex + tFall;

          // Solve horizontal velocity needed to hit player target point
          const vx = diff.x / totalTime;

          this.velocity = vec2(vx, vy);
        } else {
          // Default upward leap if no player is found
          this.velocity = vec2(this.direction * 0.15, 0.4);
        }
      }

    }
    // --- STATE 2: JUMP (Parabolic Arc) ---
    else if (this.state === 'jump') {
      // Apply gravity pulling boss down
      this.velocity.y -= this.gravity;

      // Update face direction based on current movement
      if (this.velocity.x !== 0) {
        this.mirror = this.velocity.x > 0;
      }

      // Check landing back at bottom Y water level
      if (this.velocity.y < 0 && this.pos.y <= bottomY) {
        this.pos.y = bottomY;
        this.state = 'patrol';

        // Trigger splash effect sound!
        this.g.sfx.play('splash', this.pos);
        Particles.swampSplash(this.pos, .5)

        // Reset timers
        this.jumpTimer.set(rand(3, 5));
        this.changeDirectionTimer.set(rand(1, 3));
        this.direction = rand() > 0.5 ? 1 : -1;
      }
    }

    // Keep X position clamped within camera bounds
    this.pos.x = clamp(this.pos.x, minX, maxX);

    // Random attacks during updates
    if (rand() > .98) {
      this.shoot();
    }
  }
}
