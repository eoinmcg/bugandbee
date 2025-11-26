/**
 * Draws a tile with an outline effect by rendering the tile multiple times
 * with slight offsets in 8 directions, then drawing the main tile on top.
 * 
 * @param {Object} options - Configuration object for the tile and outline
 * @param {Vector2} options.pos - Position to draw the tile
 * @param {Vector2} options.size - Size of the tile
 * @param {TileInfo} options.tileInfo - Tile information (from tile() function)
 * @param {Color} [options.color=Color(1,1,1)] - Color of the main tile
 * @param {number} [options.angle=0] - Rotation angle in radians
 * @param {boolean} [options.mirror=false] - Whether to mirror the tile
 * @param {Color} [options.outlineColor=Color(0,0,0)] - Color of the outline
 * @param {number} [options.outlineOffset=0.1] - Distance of outline from tile edge
 * 
 * @example
 * outlineTile({
 *   pos: vec2(5, 5),
 *   size: vec2(2, 2),
 *   tileInfo: tile(0, tileSize),
 *   outlineColor: new Color(0, 0, 0),
 *   outlineOffset: 0.1
 * });
 */
export function outlineTile(options) {
  const {
    pos,
    size,
    tileInfo,
    color = new Color(1, 1, 1),
    angle = 0,
    mirror = false,
    outlineColor = new Color(0, 0, 0),
    outlineOffset = 0.1
  } = options;

  const offsets = getOffsets(outlineOffset);

  for (const offsetVec of offsets) {
    drawTile(pos.add(offsetVec), size, tileInfo, outlineColor, angle, mirror);
  }

  drawTile(pos, size, tileInfo, color, angle, mirror);
}

export function outlineText(text, font, pos, size) {

  const offsets = getOffsets(.1);

  for (const offsetVec of offsets) {
    font.drawTextOverlay(text, pos.add(offsetVec),
      size, true
    );
  }

}

function getOffsets(outlineOffset) {

  const steps = [-outlineOffset, 0, outlineOffset];
  const offsets = [];
  for (const x of steps) {
    for (const y of steps) {
      if (x !== 0 || y !== 0) {
        offsets.push(vec2(x, y));
      }
    }
  }

  return offsets;

}
