import Config from "./config";


const paths = {
  topRightZig: [
    vec2(12, 15),
    vec2(12, -8),
    vec2(-12, -10),
    vec2(0, 0),
    vec2(-16, 0)
  ],
  topCenterZig: [
    vec2(0.0, 12.5),
    vec2(-0.1, 7.4),
    vec2(-0.4, 2.0),
    vec2(-0.5, -2.5),
    vec2(-0.5, -7.1),
    vec2(-0.8, -12.5),
    vec2(2.8, -0.2),
    vec2(7.7, 9.1),
    vec2(14.7, 12.4),
    vec2(3.1, 3.6),
    vec2(-6.2, -3.1),
    vec2(-14.9, -0.5),
  ],
  circle: [
    vec2(14.8, 12.5),
    vec2(14.2, 10.4),
    vec2(13.3, 6.5),
    vec2(10.1, -0.6),
    vec2(6.2, -5.5),
    vec2(2.1, -9.0),
    vec2(-2.1, -9.0),
    vec2(-5.5, -4.9),
    vec2(-5.0, 1.0),
    vec2(-3.6, 2.3),
    vec2(-0.3, 4.3),
    vec2(4.1, 5.7),
    vec2(5.9, 5.7),
    vec2(8.0, 5.4),
    vec2(8.4, 1.8),
    vec2(4.6, -3.5),
    vec2(0.2, -5.1),
    vec2(-0.6, -0.7),
    vec2(1.5, 2.9),
    vec2(4.7, 2.0),
    vec2(2.3, -0.3),
    vec2(-4.1, -3.9),
    vec2(-11.4, -7.4),
    vec2(-14.6, -9.6),
  ],
  circleBottom: [
    vec2(14.9, -12.4),
    vec2(11.3, -10.7),
    vec2(7.6, -9.3),
    vec2(2.0, -8.1),
    vec2(-2.8, -6.3),
    vec2(-5.8, -3.9),
    vec2(-7.6, 0.1),
    vec2(-6.6, 4.5),
    vec2(-2.6, 6.4),
    vec2(2.3, 6.5),
    vec2(6.7, 4.9),
    vec2(7.3, 1.2),
    vec2(4.3, -2.1),
    vec2(0.2, -3.5),
    vec2(-3.9, -4.9),
    vec2(-7.3, -5.3),
    vec2(-10.9, -3.1),
    vec2(-14.9, -0.5),
  ],
  rightV: [
    vec2(15.0, -11.9),
    vec2(11.3, -6.6),
    vec2(5.1, 3.7),
    vec2(-0.6, 12.4),
    vec2(-1.9, 7.1),
    vec2(-4.6, 0.6),
    vec2(-8.4, -6.6),
    vec2(-15.6, -12),
  ],
  bottomRightLeft: [
    vec2(1.6, -12.3),
    vec2(1.7, -11.0),
    vec2(2.7, -9.6),
    vec2(7.3, -5.1),
    vec2(14.6, 0.3),
    vec2(13.6, 1.4),
    vec2(3.6, -0.3),
    vec2(-14.9, -0.4),
  ],
  test: [
    vec2(9.8, 9.4),
    vec2(7.2, 5.2),
    vec2(2.5, -0.2),
    vec2(-3.5, -4.6),
    vec2(-11.0, -8.2),
    vec2(-14.1, -9.4),
  ],
};

function scalePathX(path, scaleX) {
  return path.map(point => vec2(point.x * scaleX, point.y));
}

if (Config.widescreen) {
  const scale = Config.widescreen ? 1422 / 960 : 1;
  for (let path in paths) {
    paths[path] = scalePathX(paths[path], scale);
  }
}

export default paths;
