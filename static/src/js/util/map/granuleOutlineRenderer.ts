import { MultiPolygon } from 'ol/geom'
import { Color } from 'ol/color'
import { determinant } from 'ol/transform'

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

// Stencil bit marking pixels already covered by an earlier granule's interior
const COVERED_INTERIOR_STENCIL_BIT = 1

/** One eligible footprint, in Canvas painter order; geometry remains owned by OpenLayers. */
export interface GranuleOutline {
  /** Opaque RGBA color: RGB channels use 0–255, alpha uses 0–1. */
  color: Color
  /** Stable OpenLayers feature identity used to detect visibility and ordering changes. */
  featureId: string
  /** Normalized, disjoint polygon parts in map coordinates, including hole rings. */
  geometry: MultiPolygon
  /** Stroke width in backing-canvas pixels, matching the Canvas painter's lineWidth. */
  strokeWidth: number
}

/** Draw offsets into the combined GPU buffer; all values count vertices, not bytes. */
interface GranuleVertexRange {
  /** First interior vertex, immediately after this granule's stroke vertices. */
  interiorStart: number
  /** Number of vertices used only to write interior coverage to the stencil. */
  interiorVertexCount: number
  /** First stroke vertex; also the start of this granule's packed mesh. */
  strokeStart: number
  /** Number of vertices forming the visible outline triangles. */
  strokeVertexCount: number
}

/** Per-frame inputs; camera and style changes do not require new mesh coordinates. */
interface OutlineFrame {
  /** OpenLayers-owned Canvas surface whose size, CSS placement and visibility we mirror. */
  canvas: HTMLCanvasElement
  /** OpenLayers affine map-to-CSS-pixel transform: [a, b, c, d, translateX, translateY]. */
  coordinateToPixelTransform: number[]
  /** Eligible outlines in ascending feature index; earlier interiors hide later strokes. */
  outlines: GranuleOutline[]
  /** VectorSource revision; feature/geometry change events invalidate the uploaded scene. */
  sourceRevision: number
}

/** Owns one map's GPU surface and resources until explicitly disposed by map cleanup. */
class OutlineRenderer {
  /** Sibling surface owned here; it never receives pointer events. */
  private canvas = document.createElement('canvas')

  /** Dedicated hardware context; no other renderer shares its mutable WebGL state. */
  private gl: WebGL2RenderingContext

  /** Handles valid only for the current context; recreated after context restoration. */
  private resources?: OutlineResources

  /** Borrowed Canvas surface; its original visibility must be restored before release. */
  private originalCanvas?: HTMLCanvasElement

  /** Visibility before GPU replacement, including inherited or explicitly hidden values. */
  private originalVisibility = ''

  /** Source revision plus ordered visible feature IDs for the last successful upload. */
  private uploadedSceneKey = ''

  /** Per-granule offsets into the single owned vertex buffer, rebuilt with each upload. */
  private vertexRanges: GranuleVertexRange[] = []

  /** A failed context restoration leaves this renderer on Canvas until map disposal. */
  private failed = false

  /** Hardware renderbuffer limit in backing pixels; oversized frames use Canvas. */
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
    // Browsers may reclaim contexts under memory pressure. preventDefault opts
    // into restoration; hide reveals Canvas while render() refuses the lost context.
    event.preventDefault()
    this.hide()
  }

  private handleContextRestored = () => {
    try {
      // Old GPU handles no longer work. CPU meshes survive, but must be uploaded
      // into a new buffer on the next eligible map frame.
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
    canvas, coordinateToPixelTransform, outlines, sourceRevision
  }: OutlineFrame) {
    const { gl, resources } = this
    if (this.failed || gl.isContextLost() || !resources) return false

    const { height, width } = canvas
    // Invalid transforms, detached surfaces and hardware size limits must leave
    // the caller free to paint this same frame using Canvas.
    if (!width || !height || !canvas.parentElement) return false
    if (width > this.maxCanvasSize || height > this.maxCanvasSize) return false
    if (!coordinateToPixelTransform.every(Number.isFinite)) return false
    if (determinant(coordinateToPixelTransform) === 0) return false

    this.prepareFrame(resources, width, height)
    this.uploadChangedGeometry(outlines, sourceRevision)
    this.setCameraUniforms(resources, coordinateToPixelTransform, width, height)
    this.vertexRanges.forEach((range, index) => {
      // Stroke first, then add only this interior to the cumulative clip. Doing
      // these passes in the opposite order would clip the granule's own stroke.
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
    resources.vertexAttributes.forEach(({ componentCount, floatOffset, location }) => {
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

    // This is a 2D painter: order comes from blending/stencil, never depth or
    // triangle winding. Reapply state each frame, including after canvas resize.
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.enable(gl.STENCIL_TEST)
    gl.stencilMask(COVERED_INTERIOR_STENCIL_BIT)
    gl.clearStencil(0)
    gl.clearColor(0, 0, 0, 0)
    gl.colorMask(true, true, true, true)
    // Clear both last frame's visible strokes and its accumulated interior mask;
    // stale stencil pixels would clip unrelated granules after camera movement.
    // clear() takes one bitmask, so OR combines the two independent buffer flags
    // in one GPU call. The lint exception applies only to this API-required mask.
    // eslint-disable-next-line no-bitwise -- WebGL clear requires OR-combined buffer flags.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
  }

  // Camera movement reuses the uploaded vertices. Only a source revision or a
  // change to the visible granules requires rebuilding the combined buffer.
  // OpenLayers forwards feature/geometry changes to the source revision. Mutate
  // shapes through its setters/change events; silent edits would leave stale data.
  // IDs are ordered because changing painter order also changes the stencil clip.
  private uploadChangedGeometry(outlines: GranuleOutline[], sourceRevision: number) {
    const featureIds = outlines.map(({ featureId }) => featureId).join(',')
    const sceneKey = `${sourceRevision}:${featureIds}`
    if (sceneKey === this.uploadedSceneKey) return

    const meshes = outlines.map(({ geometry }) => geometryMesh(geometry))

    let vertexCount = 0
    this.vertexRanges = meshes.map((mesh) => {
      const range = {
        interiorStart: vertexCount + mesh.strokeCount,
        interiorVertexCount: mesh.fillCount,
        strokeStart: vertexCount,
        strokeVertexCount: mesh.strokeCount
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

    // OpenLayers supplies CSS pixels, while viewport and rasterization use the
    // canvas's backing pixels. Scale the linear transform once by device ratio.
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

    // Dividing by this zoom scale in the shader keeps stroke offsets at the same
    // backing-pixel width as Canvas, even during zoom and rotation.
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
    // WeakMap ownership alone cannot release DOM nodes, event listeners or GPU
    // allocations. Remove recovery listeners before deliberately losing context.
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
    // Keep GPU allocations for the next interaction, but return visibility to
    // Canvas for settled frames, ineligible scenes and recoverable context loss.
    if (this.originalCanvas) this.originalCanvas.style.visibility = this.originalVisibility
    this.originalCanvas = undefined
    this.canvas.style.visibility = 'hidden'
  }
}

export default OutlineRenderer
