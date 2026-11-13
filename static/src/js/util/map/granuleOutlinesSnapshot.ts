import { Map } from 'ol'
import { Coordinate } from 'ol/coordinate'
import VectorSource from 'ol/source/Vector'

// Drawing the granule outlines is slow when there are a lot of overlapping granules. It is
// too slow to do every time the map is drawn, which is many times a second while the map is
// being panned or zoomed.
//
// Instead, every time the outlines are drawn we save a copy of the canvas (a snapshot). The
// next time the map is drawn, the snapshot is drawn back onto the canvas if it still shows the
// right thing:
//   - If nothing has changed, the snapshot is exactly what would be drawn anyway.
//   - If the map is being panned or zoomed, the snapshot is moved and scaled to line up with
//     the current view. OpenLayers does the same thing with tile layers while zooming, the
//     existing picture is stretched for a moment and replaced with a sharp one afterwards.
//
// Drawing the snapshot takes the same amount of time no matter how many granules are in it.

// The most a snapshot can be scaled up (or down) before it has to be replaced. The outlines
// are thin lines, so they look wrong if they are stretched any further than this.
const maxSnapshotScale = 2

// How far (in pixels) the corners of a snapshot can be from the corners of the canvas for the
// map to be treated as not having moved since the snapshot was saved
const unmovedTolerance = 0.01

type GranuleOutlinesSnapshot = {
  /** A copy of the granule outlines canvas */
  canvas: HTMLCanvasElement
  /** The revision of the granule backgrounds source when the snapshot was saved */
  sourceRevision: number
  /** The map coordinate that was in the top left corner of the canvas */
  topLeft: Coordinate
  /** The map coordinate that was in the top right corner of the canvas */
  topRight: Coordinate
  /** The map coordinate that was in the bottom left corner of the canvas */
  bottomLeft: Coordinate
}

// The snapshot for each map. Changing the projection creates a new map, using a WeakMap means
// the snapshot for the old map is thrown away with it.
const snapshots = new WeakMap<Map, GranuleOutlinesSnapshot>()

/**
 * Saves a copy of the granule outlines that have just been drawn on the canvas
 * @param {Object} params
 * @param {Object} params.ctx The canvas context the granule outlines were drawn on
 * @param {Object} params.granuleBackgroundsSource The OL source for the granule backgrounds
 * @param {Object} params.map The OL map
 */
export const saveGranuleOutlinesSnapshot = ({
  ctx,
  granuleBackgroundsSource,
  map
}: {
  /** The canvas context the granule outlines were drawn on */
  ctx: CanvasRenderingContext2D
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The map the granule outlines were drawn for */
  map: Map
}) => {
  const { height, width } = ctx.canvas

  // Reuse the canvas from the map's previous snapshot if there is one
  const canvas = snapshots.get(map)?.canvas || document.createElement('canvas')

  // Make the snapshot the same size as the granule outlines canvas
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height

  // Replace the previous snapshot with a copy of the granule outlines canvas
  const snapshotCtx = canvas.getContext('2d') as CanvasRenderingContext2D
  snapshotCtx.clearRect(0, 0, width, height)
  snapshotCtx.drawImage(ctx.canvas, 0, 0)

  // The canvas is sized in device pixels, but the map works in CSS pixels
  const dpr = window.devicePixelRatio || 1

  snapshots.set(map, {
    canvas,
    // The revision changes any time a granule is added, removed or changed. It is how we
    // know if the snapshot still shows the right granules.
    sourceRevision: granuleBackgroundsSource.getRevision(),
    // Remember where on the map the corners of the canvas are. Three corners are enough to
    // work out where the snapshot belongs after the map has been moved, zoomed or rotated.
    topLeft: map.getCoordinateFromPixel([0, 0]),
    topRight: map.getCoordinateFromPixel([width / dpr, 0]),
    bottomLeft: map.getCoordinateFromPixel([0, height / dpr])
  })
}

/**
 * Draws the saved copy of the granule outlines, lined up with the map's current view.
 * @param {Object} params
 * @param {Object} params.ctx The canvas context to draw on
 * @param {Object} params.granuleBackgroundsSource The OL source for the granule backgrounds
 * @param {Boolean} params.isMoving If the map is currently being panned or zoomed
 * @param {Object} params.map The OL map
 * @returns {Boolean} `false` if there is no snapshot that can be used. Nothing has been drawn, so the granule outlines need to be drawn again.
 */
export const drawGranuleOutlinesSnapshot = ({
  ctx,
  granuleBackgroundsSource,
  isMoving,
  map
}: {
  /** The canvas context to draw on */
  ctx: CanvasRenderingContext2D
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** If the map is currently being panned or zoomed */
  isMoving: boolean
  /** The map to draw on */
  map: Map
}) => {
  const snapshot = snapshots.get(map)

  // If the outlines haven't been drawn on this map yet, there is no snapshot
  if (!snapshot) return false

  const { canvas } = snapshot
  const { height, width } = canvas

  // If the granules have changed since the snapshot was saved, it shows the wrong granules
  if (snapshot.sourceRevision !== granuleBackgroundsSource.getRevision()) return false

  // If the map has been resized, the snapshot no longer fits the canvas
  if (width !== ctx.canvas.width || height !== ctx.canvas.height) return false

  // The canvas is sized in device pixels, but the map works in CSS pixels
  const dpr = window.devicePixelRatio || 1

  // Find where the corners of the snapshot belong on the canvas in the current view
  const [left, top] = map.getPixelFromCoordinate(snapshot.topLeft)
    .map((value) => value * dpr)
  const [topRightX, topRightY] = map.getPixelFromCoordinate(snapshot.topRight)
    .map((value) => value * dpr)
  const [bottomLeftX, bottomLeftY] = map.getPixelFromCoordinate(snapshot.bottomLeft)
    .map((value) => value * dpr)

  // If the corners of the snapshot are still in the corners of the canvas, the map hasn't
  // moved since the snapshot was saved. The snapshot is exactly what would be drawn if the
  // outlines were drawn again, so draw it as it is.
  const distanceMoved = Math.max(
    Math.abs(left),
    Math.abs(top),
    Math.abs(topRightX - width),
    Math.abs(topRightY),
    Math.abs(bottomLeftX),
    Math.abs(bottomLeftY - height)
  )

  if (distanceMoved < unmovedTolerance) {
    ctx.drawImage(canvas, 0, 0)

    return true
  }

  // The map has moved since the snapshot was saved. If the map has stopped moving, the
  // outlines need to be drawn again so they are sharp and in exactly the right place.
  if (!isMoving) return false

  // The map is still moving, so the snapshot can be moved and scaled to line up with the map
  // until it stops. There are two cases where that doesn't look good enough, and the outlines
  // need to be drawn again even though the map is moving.

  // If the map has been zoomed too far since the snapshot was saved, the outlines would be
  // drawn too thick or too thin. Comparing the length of the snapshot's top edge now to the
  // length it was saved with tells us how much it would be scaled.
  const scale = Math.hypot(topRightX - left, topRightY - top) / width
  if (scale > maxSnapshotScale || scale < 1 / maxSnapshotScale) return false

  // If the map has been panned so far that the middle of the snapshot is off the canvas, the
  // snapshot covers less than half of the map. The middle of the snapshot is halfway between
  // its top right and bottom left corners.
  const centerX = (topRightX + bottomLeftX) / 2
  const centerY = (topRightY + bottomLeftY) / 2
  if (centerX < 0 || centerX > width || centerY < 0 || centerY > height) return false

  ctx.save()

  // Move, scale and rotate the canvas so that drawing the snapshot puts its corners at the
  // positions found above. `setTransform(a, b, c, d, e, f)` draws the snapshot's pixel at
  // (x, y) on the canvas at (a * x + c * y + e, b * x + d * y + f). So (0, 0) is drawn at the
  // top left position, (width, 0) at the top right and (0, height) at the bottom left.
  ctx.setTransform(
    (topRightX - left) / width,
    (topRightY - top) / width,
    (bottomLeftX - left) / height,
    (bottomLeftY - top) / height,
    left,
    top
  )

  ctx.drawImage(canvas, 0, 0)

  ctx.restore()

  return true
}
