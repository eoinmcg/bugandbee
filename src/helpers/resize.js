
export default function resize(w, h) {
  // w = 1422; h = 800;
  setCanvasMaxSize(vec2(w, h));
  setCanvasFixedSize(vec2(w, h));

  canvasMinAspect = 1.6
  canvasMaxAspect = 2;
}

