import Boss from './boss';

export default class EyeBoss extends Boss {
  constructor(g, props) {
    super(g, {
      pos: props.pos,
      size: vec2(3),
      tile: g.tile('eye0'),
      health: 50,
      value: 500,
    });
    this.anims = {
      idle: ['eye', 'eye'],
      charge: ['eye'],
    };
    this.changeAnim('idle', .2);
    this.g.stopMusic();
    window.setTimeout(() => {
      this.g.playMusic(6);
    }, 10);

    this.state = 'floating'; // 'floating', 'charging', 'zooming'
    this.floatSpeed = 0.2;
    this.zoomSpeed = 1.2;
    this.verticalDirection = 1; // 1 = down, -1 = up
    this.side = this.pos.x < 0 ? 'left' : 'right'; // Which side of screen
    this.chargeTimer = new Timer(rand(2, 4)); // Time until zoom charge
    this.floatRange = 5; // How far to float up/down
    this.startY = this.pos.y;
  }

  update() {
    super.update();
    const size = this.g.size;
    // const half = this.size.x / 2;
    const half = 0;
    const minX = size.min.x + half;
    const maxX = size.max.x - half;
    const minY = size.min.y + (half * 2);
    const maxY = size.max.y - half;

    if (this.state === 'floating') {
      // Float up and down
      this.velocity.y = this.verticalDirection * this.floatSpeed;
      this.velocity.x = 0;

      // Keep on assigned side
      const targetX = this.side === 'left' ? minX + 1 : maxX - 1;
      if (Math.abs(this.pos.x - targetX) > 0.1) {
        this.pos.x += (targetX - this.pos.x) * 0.1;
      }

      // Reverse direction at float limits
      if (this.pos.y > this.startY + this.floatRange) {
        this.verticalDirection = -1;
      } else if (this.pos.y < this.startY - this.floatRange) {
        this.verticalDirection = 1;
      }

      // Mirror based on which side (eye looks toward center)
      this.mirror = this.pos.x < 0;

      // Check if time to charge
      if (this.chargeTimer.elapsed()) {
        this.state = 'charging';
        this.changeAnim('charge', .1);
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.chargeTime = new Timer(0.5); // Brief pause before zoom
        this.g.sfx.play('jump', this.pos);
      }
    }
    else if (this.state === 'charging') {
      // Brief pause while charging
      this.velocity.x = 0;
      this.velocity.y = 0;

      if (this.chargeTime.elapsed()) {
        this.state = 'zooming';
        // Zoom to opposite side
        const direction = this.side === 'left' ? 1 : -1;
        this.velocity.x = direction * this.zoomSpeed;
        this.velocity.y = 0;
      }
    }
    else if (this.state === 'zooming') {
      // Maintain zoom velocity
      // Check if reached other side
      if ((this.side === 'left' && this.pos.x >= maxX - 1) ||
        (this.side === 'right' && this.pos.x <= minX + 1)) {
        // Switch sides and return to floating
        this.side = this.side === 'left' ? 'right' : 'left';
        this.state = 'floating';
        this.startY = this.pos.y;
        this.verticalDirection = rand() > 0.5 ? 1 : -1;
        this.chargeTimer.set(rand(2, 4));
        this.changeAnim('idle', .2);
        this.g.sfx.play('smash', this.pos);
      }
    }

    // Clamp position to bounds
    this.pos.x = clamp(this.pos.x, minX, maxX);
    this.pos.y = clamp(this.pos.y, minY, maxY);

    // Occasional shooting
    if (rand() > .96) {
      this.shoot();
    }
  }

  collideWithObject(o) {
    if (o.name === 'platform') {
      this.verticalDirection *= -1;
      return;
    }
    super.collideWithObject(o);
  }
}
