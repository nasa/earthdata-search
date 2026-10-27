import { Map } from 'ol'
import Feature from 'ol/Feature'
import { Geometry, MultiPolygon } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import Stroke from 'ol/style/Stroke'
import { asArray, Color } from 'ol/color'
import { determinant } from 'ol/transform'
import { getUid } from 'ol/util'

import isMaskCompatibleGeometry from './isMaskCompatibleGeometry'
import {
  geometryMesh,
  VERTEX_FLOATS,
  VERTEX_STRIDE
} from './granuleOutlineMesh'
import {
  createHardwareContext,
  createOutlineResources,
  OutlineResources
} from './granuleOutlineWebGl'

export {
  fillTriangles,
  geometryMesh,
  strokeTriangles
} from './granuleOutlineMesh'

// Below this many visible granules the Canvas painter is already fast enough
const MIN_GPU_FEATURE_COUNT = 10

// Stencil bit marking pixels already covered by an earlier granule's interior
const COVERED_INTERIOR_STENCIL_BIT = 1

interface GranuleOutline {
  featureId: string
  geometry: MultiPolygon
  color: Color
  strokeWidth: number
}

interface GranuleVertexRange {
  strokeStart: number
  strokeVertexCount: number
  interiorStart: number
  interiorVertexCount: number
}

interface OutlineFrame {
  canvas: HTMLCanvasElement
  outlines: GranuleOutline[]
  coordinateToPixelTransform: number[]
  sourceRevision: number
}

const getGranuleStroke = (feature: Feature<Geometry>): Stroke | undefined => {
  const style = feature.get('granuleStyle')

  // Point granules carry their stroke on the image style.
  return style?.getStroke() || style?.getImage()?.getStroke() || undefined
}

class OutlineRenderer {
  private canvas = document.createElement('canvas')

  private gl: WebGL2RenderingContext

  private resources?: OutlineResources

  private originalCanvas?: HTMLCanvasElement

  private originalVisibility = ''

  private uploadedSceneKey = ''

  private vertexRanges: GranuleVertexRange[] = []

  private failed = false

  private maxCanvasSize: number

  constructor() {
    this.gl = createHardwareContext(this.canvas)
    this.maxCanvasSize = this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE)
    try {
      this.initializeResources()
    } catch (error) {
      this.gl.getExtension('WEBGL_lose_context')?.loseContext()
      throw error
    }

    this.canvas.addEventListener('webglcontextlost', this.handleContextLost)
    this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored)
  }

  private handleContextLost = (event: Event) => {
    // Allow browser recovery and expose the Canvas fallback immediately.
    event.preventDefault()
    this.hide()
  }

  private handleContextRestored = () => {
    try {
      this.initializeResources()
    } catch {
      this.failed = true
      this.hide()
    }
  }

  private initializeResources() {
    this.resources = createOutlineResources(this.gl)
    // Context restoration invalidates GPU buffers even if the scene is unchanged.
    this.uploadedSceneKey = ''
    this.vertexRanges = []
  }

  render({
    canvas, outlines, coordinateToPixelTransform, sourceRevision
  }: OutlineFrame) {
    const { gl, resources } = this
    if (this.failed || gl.isContextLost() || !resources) return false

    const { width, height } = canvas
    if (!width || !height || !canvas.parentElement) return false
    if (width > this.maxCanvasSize || height > this.maxCanvasSize) return false
    if (!coordinateToPixelTransform.every(Number.isFinite)) return false
    if (determinant(coordinateToPixelTransform) === 0) return false

    this.prepareFrame(resources, width, height)
    this.uploadChangedGeometry(outlines, sourceRevision)
    this.setCameraUniforms(resources, coordinateToPixelTransform, width, height)
    this.vertexRanges.forEach((range, index) => {
      this.drawVisibleStroke(resources, outlines[index], range)
      this.markCoveredInterior(range)
    })

    gl.colorMask(true, true, true, true)
    this.showGpuCanvasInPlaceOf(canvas)

    return true
  }

  private prepareFrame(resources: OutlineResources, width: number, height: number) {
    const { gl } = this
    if (this.canvas.width !== width) this.canvas.width = width
    if (this.canvas.height !== height) this.canvas.height = height

    gl.viewport(0, 0, width, height)
    gl.useProgram(resources.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.vertexBuffer)
    resources.vertexAttributes.forEach(({ location, componentCount, floatOffset }) => {
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(
        location,
        componentCount,
        gl.FLOAT,
        false,
        VERTEX_STRIDE,
        floatOffset * Float32Array.BYTES_PER_ELEMENT
      )
    })

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.enable(gl.STENCIL_TEST)
    gl.stencilMask(COVERED_INTERIOR_STENCIL_BIT)
    gl.clearStencil(0)
    gl.clearColor(0, 0, 0, 0)
    gl.colorMask(true, true, true, true)
    // eslint-disable-next-line no-bitwise -- WebGL clear accepts buffer bit flags.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
  }

  // Camera movement reuses the uploaded vertices. Only a source revision or a
  // change to the visible granules requires rebuilding the combined buffer.
  private uploadChangedGeometry(outlines: GranuleOutline[], sourceRevision: number) {
    const featureIds = outlines.map(({ featureId }) => featureId).join(',')
    const sceneKey = `${sourceRevision}:${featureIds}`
    if (sceneKey === this.uploadedSceneKey) return

    const meshes = outlines.map(({ geometry }) => geometryMesh(geometry))

    let vertexCount = 0
    this.vertexRanges = meshes.map((mesh) => {
      const range = {
        strokeStart: vertexCount,
        strokeVertexCount: mesh.strokeCount,
        interiorStart: vertexCount + mesh.strokeCount,
        interiorVertexCount: mesh.fillCount
      }
      vertexCount += mesh.vertices.length / VERTEX_FLOATS

      return range
    })

    const vertices = new Float32Array(vertexCount * VERTEX_FLOATS)
    meshes.forEach((mesh, index) => {
      vertices.set(mesh.vertices, this.vertexRanges[index].strokeStart * VERTEX_FLOATS)
    })

    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)
    this.uploadedSceneKey = sceneKey
  }

  private setCameraUniforms(
    resources: OutlineResources,
    coordinateToPixelTransform: number[],
    width: number,
    height: number
  ) {
    const { gl } = this
    const { uniforms } = resources
    const [
      xScale, ySkew, xSkew, yScale, translateX, translateY
    ] = coordinateToPixelTransform
    const transformDeterminant = determinant(coordinateToPixelTransform)

    const pixelRatio = window.devicePixelRatio || 1

    // Invert the map-to-CSS-pixel transform at the canvas center. Subtracting
    // this center before the Float32 transform keeps edges stable at high zoom.
    const pixelX = width / (2 * pixelRatio) - translateX
    const pixelY = height / (2 * pixelRatio) - translateY
    const centerX = (yScale * pixelX - xSkew * pixelY) / transformDeterminant
    const centerY = (xScale * pixelY - ySkew * pixelX) / transformDeterminant
    const highX = Math.fround(centerX)
    const highY = Math.fround(centerY)

    gl.uniform2f(uniforms.viewportSize, width, height)
    gl.uniform2f(uniforms.cameraCenterHigh, highX, highY)
    gl.uniform2f(uniforms.cameraCenterLow, centerX - highX, centerY - highY)
    gl.uniformMatrix2fv(uniforms.mapToDevicePixels, false, [
      xScale * pixelRatio, ySkew * pixelRatio, xSkew * pixelRatio, yScale * pixelRatio
    ])

    gl.uniform1f(uniforms.pixelsPerMapUnit, Math.hypot(xScale, ySkew) * pixelRatio)
  }

  private drawVisibleStroke(
    resources: OutlineResources,
    outline: GranuleOutline,
    range: GranuleVertexRange
  ) {
    const { gl } = this
    const { uniforms } = resources
    const { color, strokeWidth } = outline

    // Draw behind earlier strokes, skipping pixels covered by earlier granules.
    // Opaque destination-over blending also prevents overlapping triangles from
    // darkening the stroke at segment joins.
    gl.colorMask(true, true, true, true)
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_DST_ALPHA,
      gl.ONE
    )

    const [red, green, blue, alpha = 1] = color
    gl.uniform4f(uniforms.strokeColor, red / 255, green / 255, blue / 255, alpha)
    gl.uniform1f(uniforms.strokeWidth, strokeWidth)
    gl.stencilMask(0)
    gl.stencilFunc(gl.EQUAL, 0, COVERED_INTERIOR_STENCIL_BIT)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
    gl.drawArrays(gl.TRIANGLES, range.strokeStart, range.strokeVertexCount)
  }

  private markCoveredInterior(range: GranuleVertexRange) {
    const { gl } = this
    // Mark the interior (excluding holes) in the stencil, without painting it.
    // Later granules are clipped by this mask, matching Canvas's cumulative clip.
    gl.colorMask(false, false, false, false)
    gl.disable(gl.BLEND)
    gl.stencilMask(COVERED_INTERIOR_STENCIL_BIT)
    gl.stencilFunc(gl.ALWAYS, COVERED_INTERIOR_STENCIL_BIT, COVERED_INTERIOR_STENCIL_BIT)
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
    gl.drawArrays(gl.TRIANGLES, range.interiorStart, range.interiorVertexCount)
  }

  // Show a sibling WebGL canvas in the layer container. Copying through Canvas
  // 2D can force GPU readback and cancel the acceleration benefit.
  private showGpuCanvasInPlaceOf(originalCanvas: HTMLCanvasElement) {
    const originalStyle = originalCanvas.style
    if (this.originalCanvas !== originalCanvas) {
      this.hide()
      this.originalCanvas = originalCanvas
      this.originalVisibility = originalCanvas.style.visibility
    }

    if (this.canvas.style.cssText !== originalCanvas.style.cssText) {
      this.canvas.style.cssText = originalCanvas.style.cssText
    }

    this.canvas.style.visibility = 'visible'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.setAttribute('aria-hidden', 'true')
    if (this.canvas.parentElement !== originalCanvas.parentElement) {
      originalCanvas.parentElement?.appendChild(this.canvas)
    }

    originalStyle.visibility = 'hidden'
  }

  dispose() {
    this.canvas.removeEventListener('webglcontextlost', this.handleContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored)
    this.hide()
    this.canvas.remove()
    if (this.resources) {
      this.gl.deleteBuffer(this.resources.vertexBuffer)
      this.gl.deleteProgram(this.resources.program)
      this.resources = undefined
    }

    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
    this.canvas.width = 0
    this.canvas.height = 0
  }

  hide() {
    if (this.originalCanvas) this.originalCanvas.style.visibility = this.originalVisibility
    this.originalCanvas = undefined
    this.canvas.style.visibility = 'hidden'
  }
}

// `null` records that WebGL is unavailable for a map so creation isn't retried every frame
const renderers = new WeakMap<Map, OutlineRenderer | null>()

export const disposeGpuGranuleOutlines = (map: Map) => {
  renderers.get(map)?.dispose()
  renderers.delete(map)
}

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
        featureId: getUid(feature),
        geometry,
        color,
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
  map,
  granuleBackgroundsSource,
  matrix
}: {
  /** The outline layer's canvas context, hidden while the GPU surface is shown */
  ctx: CanvasRenderingContext2D
  /** The map to draw on */
  map: Map
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The frame's coordinate-to-CSS-pixel transform */
  matrix: number[]
}) => {
  // Only the geographic projection has been validated against the Canvas painter
  if (map.getView().getProjection().getCode() !== 'EPSG:4326') return false

  const features = granuleBackgroundsSource.getFeaturesInExtent(
    map.getView().calculateExtent(map.getSize())
  ).sort((a, b) => a.get('index') - b.get('index'))
  if (features.length < MIN_GPU_FEATURE_COUNT) return false

  let outlines: GranuleOutline[] | undefined
  try {
    outlines = getGpuCompatibleOutlines(features)
  } catch {
    // Unparseable style colors fall back to the Canvas painter
    return false
  }

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
      outlines,
      coordinateToPixelTransform: matrix,
      sourceRevision: granuleBackgroundsSource.getRevision()
    }) ?? false
  } catch {
    renderers.get(map)?.dispose()
    renderers.set(map, null)

    return false
  }
}

export default drawGpuGranuleOutlines
