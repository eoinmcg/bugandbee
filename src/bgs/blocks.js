import Game from "../core/game";
import Config from "../data/config";

export class BgBlock extends EngineObject {
  constructor(pos, size, col, speed, shape) {
    super(pos, size);
    this.pos = pos;
    this.size = size;
    this.col = col;
    this.speed = speed;
    this.pos.y += rand(0, .2);
    this.maxW = Game.widescreen ? 32 : 18;
    this.renderOrder = -4;
  }


  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) this.reset()
  }

  reset() {
    this.pos.x = this.maxW;
  }

  render() {
    drawRect(this.pos.add(vec2(-.25, 0)), this.size.add(vec2(.5, 0)), this.col);
  }
}

export class BgWater extends EngineObject {
  constructor(pos, size, col = new Color(0.1, 0.4, 0.8, 0.7), speed = 0.05) {
    super(pos, size);
    this.basePos = pos.copy();
    this.col = col;
    this.speed = speed;

    this.waveFrequency = rand(1.5, 3);
    this.waveAmplitude = rand(0.08, 0.18);
    this.timeOffset = rand(0, Math.PI * 2);
    this.size.y *= 3;
    this.size.x *= 1.1;

    this.maxW = Game.widescreen ? 32 : 18;
    this.renderOrder = 30000;

    this.foamCol = new Color(1, 1, 1, 0.3);
    this.deepCol = this.col.add(new Color(-0.05, -0.1, -0.1, 0));
  }

  update() {
    // 1. Update horizontal base position
    this.basePos.x += this.speed;

    // 2. Handle screen wrap for BOTH left-moving and right-moving blocks
    if (this.speed < 0 && this.basePos.x <= -this.maxW) {
      this.basePos.x = this.maxW; // Moving left: wrap to right
    } else if (this.speed > 0 && this.basePos.x >= this.maxW) {
      this.basePos.x = -this.maxW; // Moving right: wrap to left
    }

    // 3. Apply sine wave offset to the final rendering position
    const wave = Math.sin(time * this.waveFrequency + this.basePos.x * 0.5 + this.timeOffset);
    this.pos.x = this.basePos.x;
    this.pos.y = this.basePos.y + (wave * this.waveAmplitude);

    // Call super.update() AT THE END after position calculations are finished
    super.update();
  }

  render() {
    drawRect(this.pos, this.size, this.col);

    const deepPos = this.pos.add(vec2(0, -this.size.y * 0.25));
    const deepSize = vec2(this.size.x, this.size.y * 0.5);
    drawRect(deepPos, deepSize, this.deepCol);

    const foamPos = this.pos.add(vec2(0, this.size.y * 0.48));
    const foamSize = vec2(this.size.x * 0.9, 0.08);
    drawRect(foamPos, foamSize, this.foamCol);
  }


}

export class Foliage extends BgBlock {

  constructor(pos, size, col, speed, shape) {
    super(pos, size, col, speed, shape);
    this.a = rand(-.5, .5);
  }

  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) {
      this.pos.x = this.maxW;
    }
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.circle, Config.tileSize), this.col, .7 + this.a);
  }

}

export class SwampFoliage extends BgBlock {

  constructor(pos, size, col, speed) {
    super(pos, size, col, speed);
    this.a = rand(1, 5);
    this.t = Math.random() > .2 ? 'tile' : 'circle'
    this.renderOrder = 30000;
  }

  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) {
      this.pos.x = this.maxW;
    }
  }

  render() {
    this.t === 'tile'
      ? drawTile(this.pos.add(vec2(0, 2)), this.size, tile(Config.atlas.round, Config.tileSize), this.col, .7 + this.a)
      : drawEllipse(this.pos, vec2(.3, 4 + this.a), CLEAR_BLACK, 0, .3, new Color(.1, .1, .1, 1))
  }

}

export class Mountain extends BgBlock {
  update() {
    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) this.pos.x = this.maxW;
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.square, Config.tileSize), this.col, .7);
  }
}

export class Trunk extends BgBlock {
  update() {
    if (Math.abs(this.angle) === 0) {
      this.resetAngle();
    }

    this.pos.x += this.speed;
    if (this.pos.x <= -this.maxW) {
      this.pos.x = this.maxW;
      this.resetAngle();
    }
  }

  resetAngle() {
    this.angle = rand(-.01, .01);
  }

  render() {
    drawTile(this.pos, this.size, tile(Config.atlas.square, Config.tileSize), this.col, this.angle);
  }
}

export class Beam extends Trunk {
  constructor(pos, size, col, speed, shape) {
    super(pos, size);
    this.size = size;
    this.col = col;
    this.speed = speed / 5;
    this.pos.y += rand(0, .2);
    this.maxW = Game.widescreen ? 32 : 18;
    this.renderOrder = -4;
  }

  resetAngle() {
    this.angle = rand(-.2, .2);
  }
}

export class BgSwampTree extends EngineObject {
  constructor(pos, size = vec2(5, 12), speed = -0.05) {
    const scale = rand(0.8, 1.8);
    const finalSize = size.scale(scale);

    super(pos, finalSize);

    this.basePos = pos.copy();
    this.speed = speed;
    this.maxW = Game.widescreen ? 32 : 18;
    this.renderOrder = -3.5;

    // Palette
    this.trunkCol = new Color(.05, .05, .05);
    this.branchCol = this.trunkCol

    // Random lean angle (-0.25 to +0.25 radians)
    this.angle = rand(-0.25, 0.25);


    // Main Trunk Triangle
    const rawTrunk = [
      vec2(-this.size.x * 0.5, -this.size.y * 0.5),
      vec2(this.size.x * 0.5, -this.size.y * 0.5),
      vec2(0, this.size.y * 0.5)
    ];
    this.trunkPoly = rawTrunk.map(v => v.rotate(this.angle));


    // Thinner Branches
    this.branches = [];
    const branchCount = randInt(3, 7); // Slightly more branches since they are thinner

    for (let i = 0; i < branchCount; i++) {
      const isLeft = i % 2 === 0;
      const heightPercent = rand(0.35, 0.85); // Spread along trunk

      // Calculate a 1.0 -> 0.2 scale multiplier as height goes up (0.35 -> 0.85)
      // Top of trunk = smaller multiplier
      const heightScale = 1.2 - ((heightPercent - 0.35) / (0.85 - 0.35)) * 0.75;

      const branchBaseY = (heightPercent - 0.5) * this.size.y;
      const branchSide = isLeft ? -1 : 1;

      // Scale reach and base thickness by height
      const branchReach = rand(2.2, 4.0) * branchSide * heightScale;
      const thicknessAtBase = rand(.5, .7) * heightScale;
      const tipYOffset = rand(-0.3, 0.6) * heightScale;

      const rawBranch = [
        vec2(0, branchBaseY),
        vec2(branchReach, branchBaseY + tipYOffset),
        vec2(0, branchBaseY + thicknessAtBase)
      ];

      const rotatedBranch = rawBranch.map(v => v.rotate(this.angle));
      this.branches.push(rotatedBranch);
    }
  }

  update() {
    this.basePos.x += this.speed;

    if (this.speed < 0 && this.basePos.x <= -this.maxW) {
      this.basePos.x = this.maxW;
    } else if (this.speed > 0 && this.basePos.x >= this.maxW) {
      this.basePos.x = -this.maxW;
    }

    const breeze = Math.sin(time * 1.5 + this.basePos.x) * 0.12;
    this.pos.x = this.basePos.x + breeze;
    this.pos.y = this.basePos.y;

    super.update();
  }

  render() {
    // 1. Draw Thin Branches
    for (const poly of this.branches) {
      const worldPoly = poly.map(v => v.add(this.pos));
      drawPoly(worldPoly, this.branchCol);
    }

    // 2. Draw Main Trunk
    const worldTrunk = this.trunkPoly.map(v => v.add(this.pos));
    drawPoly(worldTrunk, this.trunkCol);
  }
}

export class BgVines extends EngineObject {
  constructor(pos = vec2(0, Game.widescreen ? 10 : 8), speed = -0.02) {
    // Standard top-screen position spanning the view
    super(pos, vec2(1));

    this.speed = speed;
    this.maxW = Game.widescreen ? 32 : 18;
    this.renderOrder = -2.5; // Render in front of trees, behind main foreground

    this.vineCol = new Color(0.08, 0.15, 0.08, 0.95); // Dark swampy foliage green
    this.shadowCol = new Color(0.03, 0.08, 0.03, 0.95); // Darker shadow vine tone

    this.vines = [];
    const vineCount = randInt(10, 18);

    for (let i = 0; i < vineCount; i++) {
      // 1. Random horizontal placement across the screen space
      const xOffset = rand(-this.maxW, this.maxW);

      // 2. Length (droop depth) and width of the elliptical curve
      const vineLength = rand(3, 8);
      const curveWidth = rand(1.5, 4.0);
      const isCurvingRight = rand() > 0.5;

      // 3. Generate points along an elliptical curve (parabolic arc)
      const segments = 10;
      const leftOutline = [];
      const rightOutline = [];

      const baseThickness = rand(0.18, 0.35);

      for (let s = 0; s <= segments; s++) {
        const t = s / segments; // Progress down the vine (0 = top, 1 = tip)

        // Elliptical X displacement: x = width * sin(t * PI/2)
        const arcX = Math.sin(t * Math.PI * 0.5) * curveWidth * (isCurvingRight ? 1 : -1);
        const arcY = -t * vineLength; // Hanging downwards

        // Taper thickness from base to tip
        const thickness = baseThickness * (1 - t * 0.85);

        // Perpendicular offset for outline thickness
        const perpX = Math.cos(t * Math.PI * 0.5) * thickness;

        leftOutline.push(vec2(xOffset + arcX - perpX, arcY));
        rightOutline.push(vec2(xOffset + arcX + perpX, arcY));
      }

      // Combine left and reversed right side to form a closed loop polygon
      const polygon = [...leftOutline, ...rightOutline.reverse()];

      this.vines.push({
        poly: polygon,
        xOffset: xOffset,
        swaySpeed: rand(1.0, 2.2),
        swayAmount: rand(0.05, 0.15),
        isShadow: rand() > 0.6 // Some vines render in shadow color
      });
    }
  }

  update() {
    // Parallax movement
    for (const vine of this.vines) {
      vine.xOffset += this.speed;

      // Wrapping logic for individual vine strands
      if (this.speed < 0 && vine.xOffset <= -this.maxW) {
        vine.xOffset = this.maxW;
      } else if (this.speed > 0 && vine.xOffset >= this.maxW) {
        vine.xOffset = -this.maxW;
      }
    }

    super.update();
  }

  render() {
    for (const vine of this.vines) {
      // Wind sway effect using sine wave
      const sway = Math.sin(time * vine.swaySpeed + vine.xOffset) * vine.swayAmount;

      // Transform local points into world coordinates with sway offset
      const worldPoly = vine.poly.map((v, idx) => {
        // Apply stronger sway near the bottom/tip (index > segments)
        const t = Math.abs(v.y) / 8; // Normalize by max length
        const swayX = sway * t * 2;

        return vec2(v.x + vine.xOffset + swayX, this.pos.y + v.y);
      });

      const col = vine.isShadow ? this.shadowCol : this.vineCol;
      drawPoly(worldPoly, col);
    }
  }
}
