import { Map } from 'ol'
import Feature from 'ol/Feature'
import { Geometry } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import Stroke from 'ol/style/Stroke'
import { asArray, Color } from 'ol/color'
import { getUid } from 'ol/util'

import isMaskCompatibleGeometry from './isMaskCompatibleGeometry'
import OutlineRenderer, { GranuleOutline } from './granuleOutlineRenderer'

export {
  fillTriangles,
  geometryMesh,
  strokeTriangles
} from './granuleOutlineMesh'

// Below this many visible granules the Canvas painter is already fast enough
const MIN_GPU_FEATURE_COUNT = 10

const getGranuleStroke = (feature: Feature<Geometry>): Stroke | undefined => {
  const style = feature.get('granuleStyle')

  // Point granules carry their stroke on the image style.
  return style?.getStroke() || style?.getImage()?.getStroke() || undefined
}

// `null` records that WebGL is unavailable for a map so creation isn't retried every frame
const renderers = new WeakMap<Map, OutlineRenderer | null>()

/** Release the map's owned GPU resources; callers must also unregister their render listener. */
export const disposeGpuGranuleOutlines = (map: Map) => {
  renderers.get(map)?.dispose()
  renderers.delete(map)
}

/** Reveal Canvas without discarding reusable GPU resources between interactions. */
export const hideGpuGranuleOutlines = (map: Map) => renderers.get(map)?.hide()

// Resolve the visible granule outlines, or `undefined` when any of them needs
// the Canvas painter's exact behavior.
const getGpuCompatibleOutlines = (features: Feature<Geometry>[]): GranuleOutline[] | undefined => {
  const outlines: GranuleOutline[] = []

  for (let index = 0; index < features.length; index += 1) {
    const feature = features[index]
    const geometry = feature.getGeometry()
    if (!geometry || !isMaskCompatibleGeometry(geometry)) return undefined

    // Unstyled granules are skipped by the Canvas painter too
    const stroke = getGranuleStroke(feature)
    if (stroke) {
      const color = asArray(stroke.getColor() as Color | string)
      const width = stroke.getWidth()

      // Translucent strokes need their own union mask to avoid double-blending
      // overlapping triangles. Leave those to the Canvas painter.
      if ((color[3] ?? 1) !== 1) return undefined
      if (width === undefined || !Number.isFinite(width) || width <= 0) return undefined

      outlines.push({
        color,
        featureId: getUid(feature),
        geometry,
        strokeWidth: width
      })
    }
  }

  return outlines
}

// Draw the granule outlines with WebGL2. Returns false when the caller should
// fall back to the Canvas painter.
const drawGpuGranuleOutlines = ({
  ctx,
  granuleBackgroundsSource,
  map,
  matrix
}: {
  /** The outline layer's canvas context, hidden while the GPU surface is shown */
  ctx: CanvasRenderingContext2D
  /** OpenLayers source; its revision tracks feature and geometry changes. */
  granuleBackgroundsSource: VectorSource
  /** Map owning the renderer, projection and visible extent. */
  map: Map
  /** The frame's coordinate-to-CSS-pixel transform */
  matrix: number[]
}) => {
  // Only the geographic projection has been validated against the Canvas painter
  if (map.getView().getProjection().getCode() !== 'EPSG:4326') return false

  const features = granuleBackgroundsSource.getFeaturesInExtent(
    map.getView().calculateExtent(map.getSize())
  ).sort((a, b) => a.get('index') - b.get('index'))
  // Use the same order as Canvas. Overlap between separate granules is allowed;
  // their interiors progressively hide later outlines in the renderer's stencil.
  if (features.length < MIN_GPU_FEATURE_COUNT) return false

  let outlines: GranuleOutline[] | undefined
  try {
    outlines = getGpuCompatibleOutlines(features)
  } catch {
    // Unparseable style colors fall back to the Canvas painter
    return false
  }

  // Eligibility is all-or-nothing: mixing painters would split their shared clip
  // and could expose outlines inside an earlier granule.
  if (!outlines) return false

  if (!renderers.has(map)) {
    try {
      renderers.set(map, new OutlineRenderer())
    } catch {
      renderers.set(map, null)
    }
  }

  try {
    return renderers.get(map)?.render({
      canvas: ctx.canvas,
      coordinateToPixelTransform: matrix,
      outlines,
      sourceRevision: granuleBackgroundsSource.getRevision()
    }) ?? false
  } catch {
    // A driver/upload/draw failure must not break map rendering or keep retrying
    // expensive setup. The caller restores Canvas on this same frame.
    renderers.get(map)?.dispose()
    renderers.set(map, null)

    return false
  }
}

export default drawGpuGranuleOutlines
