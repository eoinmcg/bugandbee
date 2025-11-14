import palette from "../data/palette";
import { Game as G } from '../core/game';

const Particles = {


  score: function () {
    let pos = vec2(rand(2, -2), -10.5);
    const color = palette.yellow.col;
    const color2 = palette.orange.col;
    new ParticleEmitter(
      vec2(pos.x, pos.y + .5), 0,            // pos, angle
      .5, .1, 15, 1, // emitSize, emitTime, emitRate, emiteCone
      tile(14, G.tileSize),                      // tileInfo
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      1, .75, 1, .2, 0.00,  // time, sizeStart, sizeEnd, speed, angleSpeed
      1, 1, 0.0, PI,   // damping, angleDamping, gravityScale, cone
      .1, .43, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  gunsmoke: function (pos, mirror, size = 1) {
    const off = (mirror) ? -.2 : .2;
    const color = palette.white.col;
    new ParticleEmitter(
      vec2(pos.x + off, pos.y), 0,            // pos, angle
      size, .1, 1, 0, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color,           // colorStartA, colorStartB
      color.scale(1, 0), color.scale(1, 0), // colorEndA, colorEndB
      .2, .8, .5, .2, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
      .99, .95, 0, PI,   // damping, angleDamping, gravityScale, cone
      -1, 0, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  gunhit: function (pos, color = false) {
    color = color || palette.white.col;

    new ParticleEmitter(
      pos, 0,            // pos, angle
      .25, .05, 10, PI, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color,           // colorStartA, colorStartB
      color.scale(1, 0), color.scale(1, 0), // colorEndA, colorEndB
      .1, .5, .2, 5, .01,  // time, sizeStart, sizeEnd, speed, angleSpeed
      .99, .95, 4, PI,   // damping, angleDamping, gravityScale, cone
      .1, .5, 0, 1        // fadeRate, randomness, collide, additive
    );

  },

  explode: function (pos, size) {
    const color = palette.maroon.col;
    const color2 = palette.orange.col;
    new ParticleEmitter(
      pos, 0,            // pos, angle
      size, .1, 200, PI, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      .3, .5, 2.5, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
      .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
      .1, .5, 0, 1        // fadeRate, randomness, collide, additive
    );
  },

  explodeBaddie(pos, size) {
    const color = new Color; // white
    const color2 = new Color(1, 0, 0); // red
    new ParticleEmitter(
      pos, 0.2,            // pos, angle
      vec2(size.x * .5), .1, 2000, PI, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      .3, 1, 2, .1, .1,  // time, sizeStart, sizeEnd, speed, angleSpeed
      .99, .95, .4, PI,   // damping, angleDamping, gravityScale, cone
      .1, .75, 0, 1        // fadeRate, randomness, collide, additive
    );

  },

  damage: function (pos, size) {
    const color = palette.red.col;
    const color2 = palette.orange.col;
    new ParticleEmitter(
      pos, 0,            // pos, angle
      2, .1, 10, 0, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      .2, size, .5 * size, .05, 0,  // time, sizeStart, sizeEnd, speed, angleSpeed
      .99, .95, 0, PI,   // damping, angleDamping, gravityScale, cone
      .1, 0, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  splash: function (pos) {
    const color = palette.white.col;
    const color2 = palette.sky.col;
    new ParticleEmitter(
      vec2(pos.x, pos.y + .5), 0,            // pos, angle
      0, .1, 200, 1, // emitSize, emitTime, emitRate, emiteCone
      G.tile('circle'),
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      1, .2, .2, .12, 0.05,  // time, sizeStart, sizeEnd, speed, angleSpeed
      1, 1, 0.25, PI,   // damping, angleDamping, gravityScale, cone
      .1, .43, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  sparks: function (pos) {
    const color = palette.red.col;
    const color2 = palette.orange.col;
    new ParticleEmitter(
      vec2(pos.x, pos.y + .5), 0,            // pos, angle
      3, .05, 200, PI, // emitSize, emitTime, emitRate, emiteCone
      G.tile('x'),
      color, color2,           // colorStartA, colorStartB
      color.scale(1, 0), color2.scale(1, 0), // colorEndA, colorEndB
      1, .5, .25, .2, 0.05,  // time, sizeStart, sizeEnd, speed, angleSpeed
      1, 1, 0.05, PI,   // damping, angleDamping, gravityScale, cone
      .1, .43, 0, 0        // fadeRate, randomness, collide, additive
    );
  },

  powerup: function (p, c = WHITE, t = 4) {
    new ParticleEmitter(
      p, PI * 2,            // pos, angle
      0, .2, 30, 1, // emitSize, emitTime, emitRate, emiteCone
      tile(t, 4),                      // tileInfo
      c, c,           // colorStartA, colorStartB
      c.scale(1, 0), c.scale(1, 0), // colorEndA, colorEndB
      1, .5, .9, .25, 0.005,  // time, sizeStart, sizeEnd, speed, angleSpeed
      1, 1, 50, PI,   // damping, angleDamping, gravityScale, cone
      0, 0, 0, 0        // fadeRate, randomness, collide, additive
    );
  },


}

export default Particles;
