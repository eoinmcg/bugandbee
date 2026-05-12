// FloatingStick
// A dynamic left-side joystick that anchors where the user first touches.

export class FloatingStick {
  constructor() {
    this.value = new Vector2(0, 0);
    this.active = false;
    this.deadzone = 0.10;
    this.radius = 200;          // px, in CSS/client space

    this._touchId = null;
    this._anchor = null;        // set on touchstart
    this._current = null;

    this._handler = this._handleTouch.bind(this);
  }

  // private
  _isLeftSide(clientX) {
    return clientX < window.innerWidth / 2;
  }

  _handleTouch(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (!this._isLeftSide(touch.clientX)) continue;

      switch (e.type) {
        case 'touchstart':
          if (this._touchId !== null) break;      // already tracking one
          this._touchId = touch.identifier;
          this._anchor = { x: touch.clientX, y: touch.clientY };
          this._current = { x: touch.clientX, y: touch.clientY };
          this.active = true;
          break;

        case 'touchmove':
          if (this._touchId !== touch.identifier) break;
          this._current = { x: touch.clientX, y: touch.clientY };
          break;

        case 'touchend':
        case 'touchcancel':
          if (this._touchId !== touch.identifier) break;
          this._touchId = null;
          this._anchor = null;
          this._current = null;
          this.active = false;
          this.value = new Vector2(0, 0);
          break;
      }
    }
  }

  update() {
    if (!this.active || !this._anchor || !this._current) return;

    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;

    let dx = ((this._current.x - this._anchor.x) * scaleX) / this.radius;
    let dy = ((this._current.y - this._anchor.y) * scaleY) / this.radius;

    // Clamp to unit circle
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) { dx /= len; dy /= len; }

    // Deadzone
    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag < this.deadzone) {
      this.value = new Vector2(0, 0);
      return;
    }

    // Snap angle to nearest 45°
    const angle = Math.atan2(dy, dx);
    const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

    // Unit vector in snapped direction, flip dy for LittleJS world convention
    this.value = new Vector2(Math.cos(snapped), -Math.sin(snapped));
  }

  render() {
    if (!this.active || !this._anchor) return;

    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;

    // Convert anchor from client space -> canvas pixels -> world
    const anchorCanvas = new Vector2(
      (this._anchor.x - rect.left) * scaleX,
      (this._anchor.y - rect.top) * scaleY
    );
    const anchorW = screenToWorld(anchorCanvas);

    // Clamp knob (oo-err!) visual to radius
    let dx = (this._current.x - this._anchor.x) * scaleX;
    let dy = (this._current.y - this._anchor.y) * scaleY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > this.radius) { dx = dx / len * this.radius; dy = dy / len * this.radius; }

    const knobCanvas = new Vector2(
      (this._anchor.x - rect.left) * scaleX + dx,
      (this._anchor.y - rect.top) * scaleY + dy
    );
    const knobW = screenToWorld(knobCanvas);

    const radiusW = this.radius / cameraScale;
    const knobRadiusW = this.radius * 0.4 / cameraScale;

    drawCircle(anchorW, radiusW, new Color(1, 1, 1, 0.25));   // outer ring
    drawCircle(knobW, knobRadiusW, new Color(1, 1, 1, 0.70));   // knob
  }

  mount() {
    document.addEventListener('touchstart', this._handler, { passive: false });
    document.addEventListener('touchmove', this._handler, { passive: false });
    document.addEventListener('touchend', this._handler, { passive: false });
    document.addEventListener('touchcancel', this._handler, { passive: false });
  }

  unmount() {
    document.removeEventListener('touchstart', this._handler);
    document.removeEventListener('touchmove', this._handler);
    document.removeEventListener('touchend', this._handler);
    document.removeEventListener('touchcancel', this._handler);
    this._touchId = null;
    this._anchor = null;
    this._current = null;
    this.value = new Vector2(0, 0);
    this.active = false;
  }
}


// FireButton
// A fixed button on the right side of the screen.
// Exposes .isDown, .wasPressed, .wasReleased  (updated each frame in update()).
export class FireButton {
  constructor() {
    this.isDown = false;
    this.wasPressed = false;
    this.wasReleased = false;
    this._touchIds = new Set();
    this._prevDown = false;
    this._handler = this._handleTouch.bind(this);
  }

  get _radiusW() {
    return Math.min(mainCanvas.width, mainCanvas.height) / cameraScale * 0.13;
  }

  _centreW() {
    const margin = this._radiusW * 0.5;
    const bottomRight = screenToWorld(new Vector2(mainCanvas.width, mainCanvas.height));
    const bottomLeft = screenToWorld(new Vector2(0, mainCanvas.height));
    return new Vector2(
      bottomRight.x - this._radiusW - margin,
      bottomLeft.y + this._radiusW + margin  // use + if Y is flipped
    );
  }
  _toWorld(clientX, clientY) {
    const rect = mainCanvas.getBoundingClientRect();
    const scaleX = mainCanvas.width / rect.width;
    const scaleY = mainCanvas.height / rect.height;
    return screenToWorld(new Vector2(
      (clientX - rect.left) * scaleX,
      (clientY - rect.top) * scaleY
    ));
  }
  _hitTest(clientX, clientY) {
    const pos = this._toWorld(clientX, clientY);
    const c = this._centreW();
    const dx = pos.x - c.x;
    const dy = pos.y - c.y;
    return Math.sqrt(dx * dx + dy * dy) <= this._radiusW;
  }
  _handleTouch(e) {
    e.preventDefault();
    for (const touch of e.changedTouches) {
      if (touch.clientX < window.innerWidth / 2) continue;
      if (e.type === 'touchstart' && this._hitTest(touch.clientX, touch.clientY)) {
        this._touchIds.add(touch.identifier);
      } else if (e.type === 'touchend' || e.type === 'touchcancel') {
        this._touchIds.delete(touch.identifier);
      }
    }
  }

  update() {
    const down = this._touchIds.size > 0;
    this.wasPressed = down && !this._prevDown;
    this.wasReleased = !down && this._prevDown;
    this.isDown = down;
    this._prevDown = down;
  }

  render() {
    const alpha = this.isDown ? 0.75 : 0.35;
    drawCircle(this._centreW(), this._radiusW, new Color(1, 1, 1, alpha));
  }

  mount() {
    document.addEventListener('touchstart', this._handler, { passive: false });
    document.addEventListener('touchend', this._handler, { passive: false });
    document.addEventListener('touchcancel', this._handler, { passive: false });
  }

  unmount() {
    document.removeEventListener('touchstart', this._handler);
    document.removeEventListener('touchend', this._handler);
    document.removeEventListener('touchcancel', this._handler);
    this._touchIds.clear();
    this.isDown = false;
    this.wasPressed = false;
    this.wasReleased = false;
    this._prevDown = false;
  }
}
