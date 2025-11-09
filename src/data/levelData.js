
export const waves = {
  // new format
  // e.g. declare as ['wave.level1a']
  level1a: { anim: 'skull', path: 'topRightZig', speed: 10, health: 2, motion: 'smooth', canShoot: .1, shotSpeed: .1 },
  // e.g. declare as ['wave.level1b']
  level1b: { anim: 'muncher', path: 'circle', speed: 6, health: 2, motion: 'linear', canShoot: .1, shotSpeed: .15 },

  // old format - just produces sth random
  topright: { anim: 'eye', path: 'topRightZig', speed: 6, health: 1, motion: 'smooth' },
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
      { start: 1, end: 10, types: ['wave.level1a'], freq: [2, 3], },
      { start: 10, end: 20, types: ['wave.level1b'], freq: [2, 3], },
      // { start: 2, end: 20, types: ['worm', 'popcorn'], freq: [2, 3] },
      // { start: 21, end: 40, types: ['popcorn', 'wave.skull'], freq: [3, 4] },
      // { start: 41, end: 65, types: ['worm', 'wave.bat', 'wave.skull'], freq: [2, 4] },
      // { start: 70, types: ['alert'], props: { text: 'DANGER!', col: 'pink', sfx: 'spotted', stopMusic: true } },
      // { start: 75, types: ['skullboss'], props: { pos: vec2(13, 5) } },
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
      { start: 1, types: ['eyeboss'], props: { pos: vec2(-10, 0) } },
      // { start: 2, end: 10, types: ['rock'], freq: [1, 2] },
      // { start: 11, end: 20, types: ['shroom'], freq: [1, 2] },
      // { start: 20, end: 40, types: ['shroom', 'rock', 'wave.eye'], freq: [1, 2] },
      // { start: 50, types: ['alert'], props: { text: 'I C U!', col: 'pink', sfx: 'spotted', stopMusic: true } },
      // { start: 55, types: ['eyeboss'], props: { pos: vec2(-10, 0) } },
    ],
  },
];
