
export const waves = {
  // new format
  // e.g. declare as ['wave.level1a']
  level1a: { anim: 'skull', path: 'topRightZig', speed: 6, health: 1, motion: 'smooth', canShoot: .1, shotSpeed: .1 },
  // e.g. declare as ['wave.level1b']
  level1b: { anim: 'muncher', path: 'circle', speed: 6, health: 2, motion: 'linear', canShoot: .1, shotSpeed: .15 },
  level1c: { anim: 'muncher', path: 'bottomRightLeft', speed: 8, health: 1, motion: 'smooth', canShoot: .1, shotSpeed: .1 },

  level4a: { anim: 'eye', path: 'circle', speed: 6, health: 2, motion: 'linear', canShoot: .1, shotSpeed: .15 },

  // old format - just produces sth random
  topright: { anim: 'skull', path: 'topRightZig', speed: 6, health: 1, motion: 'smooth' },
  circle: { anim: 'skull', path: 'circle', speed: 8, health: 2, motion: 'smooth' },
  topcenter: { anim: 'skull', path: 'topCenterZig', speed: 8, health: 2, motion: 'smooth' },
  bottomright: { anim: 'skull', path: 'bottomRight', speed: 8, health: 2, motion: 'smooth' },
}

export const levels = [
  {
    title: 'Mayhem Meadow',
    sky: 'day',
    audio: 2,
    bg: 'Meadow',
    speed: [2, 0],
    phases: [
      { start: 0, end: 40, types: ['popcorn'], freq: [3, 5] },
      { start: 30, end: 50, types: ['worm'], freq: [3, 5] },
      { start: 45, end: 70, types: ['wave.level1a', 'wave.level1c'], freq: [4, 5], },
      { start: 70, types: ['alert'], props: { text: 'DANGER!', col: 'pink', sfx: 'spotted', stopMusic: true } },
      { start: 75, types: ['skullboss'], props: { pos: vec2(13, 5) } },
    ]
  },
  {
    title: 'Freaky Forest',
    sky: 'night',
    audio: 3,
    bg: 'Forest',
    speed: [2, 0],
    phases: [
      { start: 2, end: 20, types: ['spider', 'popcorn', 'worm'], freq: [1, 2] },
      { start: 21, end: 40, types: ['spider', 'popcorn', 'shroom'], freq: [1, 2] },
      { start: 41, end: 67, types: ['worm', 'wave.flappy', 'wave.muncher'], freq: [4, 5] },
      { start: 70, types: ['alert'], props: { text: 'BEWARE SPIDERS!', sfx: 'spotted', stopMusic: true } },
      { start: 75, types: ['spiderboss'], props: { pos: vec2(-10, 10) } },
    ],
  },
  {
    title: 'Deadly Descent',
    bg: 'Tunnel',
    audio: 4,
    length: 5000,
    speed: [2, 0],
    platforms: ['top', 'bottom'],
    sloping: true,
    rocks: true,
    phases: [
      { start: 45, types: ['levelComplete'] },
      { start: 2, end: 10, types: ['shroom'], freq: [1, 2] },
      { start: 10, end: 20, types: ['seeker'], freq: [1, 2] },
      { start: 20, end: 40, types: ['seeker', 'shroom'], freq: [.5, 1] },
    ],
  },
  {
    title: 'Terror TuNneLs',
    bg: 'Underground',
    platforms: ['top', 'bottom'],
    audio: 5,
    speed: [1, 0],
    phases: [
      // { start: 0, types: ['eyeboss'], props: { pos: vec2(-10, 0) } },
      { start: 2, end: 10, types: ['rock'], freq: [1, 2] },
      { start: 11, end: 20, types: ['shroom'], freq: [1, 2] },

      { start: 0, end: 40, types: ['shroom', 'rock', 'wave.level4a'], freq: [1, 2] },
      { start: 50, types: ['alert'], props: { text: 'I C U!', col: 'pink', sfx: 'spotted', stopMusic: true } },
      { start: 55, types: ['eyeboss'], props: { pos: vec2(-10, 0) } },
    ],
  },
];
