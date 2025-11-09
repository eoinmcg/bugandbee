import Boss from './boss';

export default class SpiderBoss extends Boss {

  constructor(g, props) {

    super(g, {
      pos: props.pos,
      size: vec2(3),
      tile: g.tile('creep0'),
      health: 50,
      value: 300,
    });

    this.anims = {
      creep: ['creep0', 'creep1'],
      jump: ['creep1'],
    };
    this.changeAnim('creep', .2);


    this.g.stopMusic();
    window.setTimeout(() => {
      this.g.playMusic(6);
    }, 10);

    this.state = 'patrol'; // 'patrol', 'pounce', 'rising'
    this.patrolSpeed = 0.2;
    this.pounceSpeed = 0.6;
    this.direction = 1; // 1 = right, -1 = left
    this.pounceTimer = new Timer(rand(3, 6)); // Random time until next pounce
    this.changeDirectionTimer = new Timer(rand(1, 3)); // Random direction changes
  }

  update() {
    super.update();
    const size = this.g.size;
    const half = this.size.x / 2;
    const minX = size.min.x + half;
    const maxX = size.max.x - half;
    const minY = size.min.y + half;
    const maxY = size.max.y - half;

    if (this.state === 'patrol') {
      this.velocity.x = this.direction * this.patrolSpeed;
      this.velocity.y = 0;
      this.mirror = this.direction > 0;

      const targetY = size.max.y - 2;
      if (Math.abs(this.pos.y - targetY) > 0.1) {
        this.pos.y += (targetY - this.pos.y) * 0.1;
      }

      if (this.pos.x > maxX) {
        this.direction = -1;
        this.pos.x = maxX;
      } else if (this.pos.x < minX) {
        this.direction = 1;
        this.pos.x = minX;
      }

      if (this.changeDirectionTimer.elapsed()) {
        if (rand() > 0.5) {
          this.direction *= -1;
        }
        this.changeDirectionTimer.set(rand(1, 3));
      }

      if (this.pounceTimer.elapsed()) {
        this.state = 'pounce';
        this.velocity.x = 0;
        this.velocity.y = -this.pounceSpeed;
        this.g.sfx.play('jump', this.pos);
      }

    }
    else if (this.state === 'pounce') {
      this.velocity.x = 0;
      this.velocity.y = -this.pounceSpeed;

      if (this.pos.y <= minY) {
        this.pos.y = minY;
        this.state = 'rising';
        this.velocity.y = this.pounceSpeed * 0.6;
        this.g.sfx.play('smash', this.pos);
      }

    }
    else if (this.state === 'rising') {
      this.velocity.x = 0;
      this.velocity.y = this.pounceSpeed * 0.6;

      const targetY = size.max.y - 2;
      if (this.pos.y >= targetY) {
        this.state = 'patrol';
        this.pos.y = targetY;
        this.pounceTimer.set(rand(3, 6));
        this.changeDirectionTimer.set(rand(1, 3));
        this.direction = rand() > 0.5 ? 1 : -1;
      }
    }

    this.pos.x = clamp(this.pos.x, minX, maxX);
    this.pos.y = clamp(this.pos.y, minY, maxY);

    if (rand() > .98) {
      this.shoot();
    }
  }
}
