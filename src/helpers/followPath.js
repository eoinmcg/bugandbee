export function followPath(enemy, timeDelta, motion = 'linear') {
  // 1️⃣ how fast the enemy moves (units per second)
  const speed = enemy.speed || 10;

  // 2️⃣ make sure we know the total path length
  if (!enemy.totalLength) {
    enemy.totalLength = 0;
    for (let i = 0; i < enemy.pathPoints.length - 1; i++) {
      enemy.totalLength += enemy.pathPoints[i].distance(enemy.pathPoints[i + 1]);
    }
  }

  // 3️⃣ advance "t" based on speed and path length
  enemy.t = (enemy.t || 0) + (speed / enemy.totalLength) * timeDelta;

  // 4️⃣ compute the position along the path
  if (motion === 'smooth') {
    enemy.pos = getSmoothPathPosition(enemy.pathPoints, enemy.t);
  } else {
    enemy.pos = getPathPosition(enemy.pathPoints, enemy.t);
  }
  if (enemy.t >= 1) { enemy.destroy(false); }
}


export function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return vec2(
    0.5 * ((2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    0.5 * ((2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  );
}

export function lerpVec(a, b, t) {
  return vec2(
    a.x + (b.x - a.x) * t,
    a.y + (b.y - a.y) * t
  );
}
export function getPathPosition(points, t) {
  const n = points.length - 1;
  const scaledT = t * n; // map [0,1] -> [0,n]
  const i = Math.floor(scaledT);
  const localT = scaledT - i;
  const p1 = points[i];
  const p2 = points[i + 1] || points[i]; // clamp at end
  return lerpVec(p1, p2, localT);
}

export function getSmoothPathPosition(points, t) {
  const n = points.length - 1;
  const scaledT = t * n;
  const i = Math.floor(scaledT);
  const localT = scaledT - i;
  const p0 = points[i - 1] || points[0];
  const p1 = points[i];
  const p2 = points[i + 1] || points[n];
  const p3 = points[i + 2] || points[n];
  return catmullRom(p0, p1, p2, p3, localT);
}
