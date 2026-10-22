import { Map } from 'ol'
import Feature from 'ol/Feature'
import { Geometry, MultiPolygon } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import Stroke from 'ol/style/Stroke'
import { asArray, Color } from 'ol/color'
import { getUid } from 'ol/util'
import { multiPolygon, tesselate } from '@turf/turf'

import isMaskCompatibleGeometry from './isMaskCompatibleGeometry'

// Below this many visible granules the Canvas painter is already fast enough
const MIN_GPU_FEATURE_COUNT = 10

// Stencil bit marking pixels already covered by an earlier granule's interior
const COVERED_MASK = 1

// Canvas 2D default `miterLimit`
const CANVAS_MITER_LIMIT = 10

// Floats per vertex: positionHigh (2) + positionLow (2) + offset (2)
const VERTEX_FLOATS = 6
const VERTEX_STRIDE = VERTEX_FLOATS * Float32Array.BYTES_PER_ELEMENT

const vertexShader = `#version 300 es
in vec2 positionHigh;
in vec2 positionLow;
in vec2 offset;
uniform vec2 size;
uniform vec2 centerHigh;
uniform vec2 centerLow;
uniform mat2 transform;
uniform float scale;
uniform float strokeWidth;
void main() {
  vec2 relative = (positionHigh - centerHigh) + (positionLow - centerLow);
  vec2 pixel = transform * relative + size * 0.5
    + transform * offset * strokeWidth / scale;
  gl_Position = vec4(pixel.x * 2.0 / size.x - 1.0,
    1.0 - pixel.y * 2.0 / size.y, 0.0, 1.0);
}`

const fragmentShader = `#version 300 es
precision highp float;
uniform vec4 color;
out vec4 outputColor;
void main() { outputColor = vec4(color.rgb * color.a, color.a); }`

type Point = [number, number]
type EmitVertex = (point: Point, center: Point) => void

interface GranuleOutline {
  feature: Feature<Geometry>
  color: Color
  width: number
}

interface Batch {
  start: number
  strokeCount: number
  fillCount: number
}

// Triangulate the polygon interiors (holes excluded) for the stencil coverage mask
export const fillTriangles = (geometry: MultiPolygon): number[] => (
  tesselate(multiPolygon(geometry.getCoordinates())).features
    .flatMap((feature) => feature.geometry.coordinates[0].slice(0, 3).flat())
)

// Exact segment rectangles plus the Canvas default miter/bevel joins. Duplicate
// zero-length segments contribute no stroke with the default butt line cap.
export const strokeTriangles = (ring: Point[], width: number, emit?: EmitVertex): number[] => {
  const points = ring.filter((point, index) => index === 0
    || point[0] !== ring[index - 1][0] || point[1] !== ring[index - 1][1])
  if (points.length > 1 && points[0][0] === points[points.length - 1][0]
    && points[0][1] === points[points.length - 1][1]) points.pop()

  if (points.length < 2) return []

  const result: number[] = []
  const half = width / 2
  const triangle = (a: Point, b: Point, c: Point, centers: Point[]) => {
    if (emit) {
      emit(a, centers[0])
      emit(b, centers[1])
      emit(c, centers[2])
    } else {
      result.push(...a, ...b, ...c)
    }
  }

  // One rectangle (two triangles) per segment
  const normals: Point[] = []
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length]
    const dx = next[0] - point[0]
    const dy = next[1] - point[1]
    const length = Math.hypot(dx, dy)
    const normal: Point = [-dy / length, dx / length]
    normals.push(normal)
    const a: Point = [point[0] + normal[0] * half, point[1] + normal[1] * half]
    const b: Point = [point[0] - normal[0] * half, point[1] - normal[1] * half]
    const c: Point = [next[0] + normal[0] * half, next[1] + normal[1] * half]
    const d: Point = [next[0] - normal[0] * half, next[1] - normal[1] * half]
    triangle(a, b, c, [point, point, next])
    triangle(b, d, c, [point, next, next])
  })

  // Fill the outer side of each corner with a miter, or a bevel past the miter limit
  points.forEach((point, index) => {
    const previous = normals[(index + points.length - 1) % points.length]
    const next = normals[index]
    const cross = previous[0] * next[1] - previous[1] * next[0]
    if (Math.abs(cross) < 1e-12) return

    const side = cross > 0 ? -1 : 1
    const a: Point = [point[0] + previous[0] * half * side,
      point[1] + previous[1] * half * side]
    const b: Point = [point[0] + next[0] * half * side,
      point[1] + next[1] * half * side]
    const divisor = 1 + previous[0] * next[0] + previous[1] * next[1]
    const mx = ((previous[0] + next[0]) * half * side) / divisor
    const my = ((previous[1] + next[1]) * half * side) / divisor
    if (
      !Number.isFinite(mx)
      || !Number.isFinite(my)
      || Math.hypot(mx, my) > half * CANVAS_MITER_LIMIT
    ) {
      triangle(point, a, b, [point, point, point])
    } else {
      const miter: Point = [point[0] + mx, point[1] + my]
      triangle(point, a, miter, [point, point, point])
      triangle(point, miter, b, [point, point, point])
    }
  })

  return result
}

const packedMeshes = new WeakMap<Geometry, {
  revision: number, vertices: Float32Array, strokeCount: number, fillCount: number
}>()

// Build (and cache by geometry revision) the interleaved stroke + fill vertices
export const geometryMesh = (geometry: MultiPolygon) => {
  const revision = geometry.getRevision()
  const cached = packedMeshes.get(geometry)
  if (cached?.revision === revision) return cached

  const values: number[] = []

  // Split coordinates into two Float32 components so uploading the mesh does
  // not shift footprint edges at high zoom. The offset is the unit-width
  // stroke extrusion from the anchoring vertex, scaled to pixels in the shader.
  const vertex = (point: Point, center: Point) => {
    const highX = Math.fround(center[0])
    const highY = Math.fround(center[1])
    values.push(
      highX,
      highY,
      center[0] - highX,
      center[1] - highY,
      point[0] - center[0],
      point[1] - center[1]
    )
  }

  geometry.getCoordinates().flat().forEach((ring) => {
    strokeTriangles(ring as Point[], 1, vertex)
  })

  const strokeCount = values.length / VERTEX_FLOATS
  const fill = fillTriangles(geometry)
  for (let index = 0; index < fill.length; index += 2) {
    const point: Point = [fill[index], fill[index + 1]]
    vertex(point, point)
  }

  const mesh = {
    revision,
    vertices: new Float32Array(values),
    strokeCount,
    fillCount: fill.length / 2
  }
  packedMeshes.set(geometry, mesh)

  return mesh
}

// Point granules carry their stroke on the image style
const getGranuleStroke = (feature: Feature<Geometry>): Stroke | undefined => {
  const style = feature.get('granuleStyle')

  return style?.getStroke() || style?.getImage()?.getStroke() || undefined
}

class OutlineRenderer {
  canvas = document.createElement('canvas')

  gl: WebGL2RenderingContext

  program?: WebGLProgram

  buffer?: WebGLBuffer

  attributes: number[] = []

  uniforms: Record<string, WebGLUniformLocation | null> = {}

  originalCanvas?: HTMLCanvasElement

  originalVisibility = ''

  sceneKey = ''

  batches: Batch[] = []

  failed = false

  maxSize: number

  lost = (event: Event) => {
    event.preventDefault()
    this.hide()
  }

  restored = () => {
    try {
      this.initialize()
    } catch {
      this.failed = true
      this.hide()
    }
  }

  constructor() {
    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      stencil: true,
      depth: false,
      antialias: true
    })
    if (!gl) throw new Error('No WebGL context')
    if (!gl.getContextAttributes()?.stencil) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      throw new Error('No stencil context')
    }

    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const rendererName = String(gl.getParameter(info?.UNMASKED_RENDERER_WEBGL || gl.RENDERER))
    if (/swiftshader|llvmpipe|software rasterizer/i.test(rendererName)) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      throw new Error('Software WebGL is slower than Canvas for these polygons')
    }

    this.gl = gl
    this.maxSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
    try {
      this.initialize()
    } catch (error) {
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      throw error
    }

    this.canvas.addEventListener('webglcontextlost', this.lost)
    this.canvas.addEventListener('webglcontextrestored', this.restored)
  }

  initialize() {
    const { gl } = this
    const shaders: WebGLShader[] = []
    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type)
      if (!shader) throw new Error('No outline shader')
      shaders.push(shader)
      gl.shaderSource(shader, code)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error('Outline shader compilation failed')
      }

      return shader
    }

    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    try {
      const vertex = compile(gl.VERTEX_SHADER, vertexShader)
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentShader)
      program = gl.createProgram()
      if (!program) throw new Error('No outline program')
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Outline link failed')
      buffer = gl.createBuffer()
      if (!buffer) throw new Error('No outline buffer')

      const linkedProgram = program
      this.attributes = ['positionHigh', 'positionLow', 'offset']
        .map((name) => gl.getAttribLocation(linkedProgram, name))

      this.uniforms = Object.fromEntries(
        ['size', 'centerHigh', 'centerLow', 'transform', 'scale', 'strokeWidth', 'color']
          .map((name) => [name, gl.getUniformLocation(linkedProgram, name)])
      )

      this.program = program
      this.buffer = buffer
      this.sceneKey = ''
      this.batches = []
    } catch (error) {
      if (program) gl.deleteProgram(program)
      if (buffer) gl.deleteBuffer(buffer)
      throw error
    } finally {
      shaders.forEach((shader) => gl.deleteShader(shader))
    }
  }

  render(
    ctx: CanvasRenderingContext2D,
    outlines: GranuleOutline[],
    matrix: number[],
    revision: number
  ) {
    const { gl, uniforms } = this
    if (this.failed || gl.isContextLost() || !this.program || !this.buffer) return false

    const { width, height } = ctx.canvas
    if (!width || !height || !ctx.canvas.parentElement) return false

    const [a, b, c, d, tx, ty] = matrix
    const determinant = a * d - b * c
    if (
      width > this.maxSize
      || height > this.maxSize
      || !matrix.every(Number.isFinite)
      || determinant === 0
    ) return false

    if (this.canvas.width !== width) this.canvas.width = width
    if (this.canvas.height !== height) this.canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.useProgram(this.program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    this.attributes.forEach((attribute, index) => {
      gl.enableVertexAttribArray(attribute)
      gl.vertexAttribPointer(
        attribute,
        2,
        gl.FLOAT,
        false,
        VERTEX_STRIDE,
        index * 2 * Float32Array.BYTES_PER_ELEMENT
      )
    })

    // Only re-upload vertices when the set of visible granules or the source changes.
    // Panning and zooming otherwise only update the camera uniforms below.
    const key = `${revision}:${outlines.map(({ feature }) => getUid(feature)).join(',')}`
    if (key !== this.sceneKey) {
      const meshes = outlines.map(({ feature }) => (
        geometryMesh(feature.getGeometry() as MultiPolygon)
      ))

      let start = 0
      this.batches = meshes.map((mesh) => {
        const batch = {
          start,
          strokeCount: mesh.strokeCount,
          fillCount: mesh.fillCount
        }
        start += mesh.vertices.length / VERTEX_FLOATS

        return batch
      })

      const vertices = new Float32Array(start * VERTEX_FLOATS)
      meshes.forEach((mesh, index) => {
        vertices.set(mesh.vertices, this.batches[index].start * VERTEX_FLOATS)
      })

      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
      this.sceneKey = key
    }

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.enable(gl.STENCIL_TEST)
    gl.stencilMask(COVERED_MASK)
    gl.clearStencil(0)
    gl.clearColor(0, 0, 0, 0)
    gl.colorMask(true, true, true, true)
    // eslint-disable-next-line no-bitwise -- WebGL clear accepts buffer bit flags.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)

    // Recover the map coordinate at the canvas center so vertices can be made
    // relative to it before the Float32 transform, preserving precision.
    const dpr = window.devicePixelRatio || 1
    const x = width / (2 * dpr) - tx
    const y = height / (2 * dpr) - ty
    const centerX = (d * x - c * y) / determinant
    const centerY = (a * y - b * x) / determinant
    const highX = Math.fround(centerX)
    const highY = Math.fround(centerY)

    gl.uniform2f(uniforms.size, width, height)
    gl.uniform2f(uniforms.centerHigh, highX, highY)
    gl.uniform2f(uniforms.centerLow, centerX - highX, centerY - highY)
    gl.uniformMatrix2fv(uniforms.transform, false, [a * dpr, b * dpr, c * dpr, d * dpr])
    gl.uniform1f(uniforms.scale, Math.hypot(a, b) * dpr)

    this.batches.forEach((batch, index) => {
      const { color, width: strokeWidth } = outlines[index]

      // Stroke pass. Opaque strokes with destination-over blending match the
      // Canvas painter's stacking and union overlapping stroke triangles per
      // MSAA sample. Pixels inside earlier granules are masked by the stencil.
      gl.colorMask(true, true, true, true)
      gl.enable(gl.BLEND)
      gl.blendFuncSeparate(
        gl.ONE_MINUS_DST_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_DST_ALPHA,
        gl.ONE
      )

      gl.uniform4f(uniforms.color, color[0] / 255, color[1] / 255, color[2] / 255, color[3] ?? 1)
      gl.uniform1f(uniforms.strokeWidth, strokeWidth)
      gl.stencilMask(0)
      gl.stencilFunc(gl.EQUAL, 0, COVERED_MASK)
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
      gl.drawArrays(gl.TRIANGLES, batch.start, batch.strokeCount)

      // Coverage pass. Mask-compatible polygons have winding 0/1, so writing
      // the interior triangles (holes excluded) into the stencil reproduces the
      // Canvas painter's cumulative clip without full-screen mask passes.
      gl.colorMask(false, false, false, false)
      gl.disable(gl.BLEND)
      gl.stencilMask(COVERED_MASK)
      gl.stencilFunc(gl.ALWAYS, COVERED_MASK, COVERED_MASK)
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE)
      gl.drawArrays(gl.TRIANGLES, batch.start + batch.strokeCount, batch.fillCount)
    })

    gl.colorMask(true, true, true, true)

    // Keep the WebGL surface in the layer's DOM container. Copying it through
    // Canvas2D forces GPU readback on some browsers and defeats acceleration.
    if (this.originalCanvas !== ctx.canvas) {
      this.hide()
      this.originalCanvas = ctx.canvas
      this.originalVisibility = ctx.canvas.style.visibility
    }

    if (this.canvas.style.cssText !== ctx.canvas.style.cssText) {
      this.canvas.style.cssText = ctx.canvas.style.cssText
    }

    this.canvas.style.visibility = 'visible'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.setAttribute('aria-hidden', 'true')
    if (this.canvas.parentElement !== ctx.canvas.parentElement) {
      ctx.canvas.parentElement?.appendChild(this.canvas)
    }

    ctx.canvas.style.visibility = 'hidden'

    return true
  }

  dispose() {
    this.canvas.removeEventListener('webglcontextlost', this.lost)
    this.canvas.removeEventListener('webglcontextrestored', this.restored)
    this.hide()
    this.canvas.remove()
    if (this.buffer) this.gl.deleteBuffer(this.buffer)
    if (this.program) this.gl.deleteProgram(this.program)
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
const getGpuOutlines = (features: Feature<Geometry>[]): GranuleOutline[] | undefined => {
  const outlines: GranuleOutline[] = []

  const supported = features.every((feature) => {
    const geometry = feature.getGeometry()
    if (!geometry || !isMaskCompatibleGeometry(geometry)) return false

    // Unstyled granules are skipped by the Canvas painter too
    const stroke = getGranuleStroke(feature)
    if (!stroke) return true

    const color = asArray(stroke.getColor() as Color | string)
    const width = stroke.getWidth()

    // A translucent stroke needs a union mask of its own; keep Canvas's original
    // behavior for that case instead of blending overlapping triangles twice.
    if ((color[3] ?? 1) !== 1) return false
    if (width === undefined || !Number.isFinite(width) || width <= 0) return false

    outlines.push({
      feature,
      color,
      width
    })

    return true
  })

  return supported ? outlines : undefined
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
    outlines = getGpuOutlines(features)
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
    return renderers.get(map)?.render(
      ctx,
      outlines,
      matrix,
      granuleBackgroundsSource.getRevision()
    ) ?? false
  } catch {
    renderers.get(map)?.dispose()
    renderers.set(map, null)

    return false
  }
}

export default drawGpuGranuleOutlines
