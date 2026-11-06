import { VERTEX_ATTRIBUTES } from './granuleOutlineMesh'

/** GPU handles owned by one OutlineRenderer; invalid after disposal or context loss. */
export interface OutlineResources {
  /** Linked vertex/fragment program; attached shaders are marked for deletion after linking. */
  program: WebGLProgram
  /** Per-frame/per-granule values; locations belong exclusively to this program. */
  uniforms: {
    /** Float32-rounded camera center in map units. */
    cameraCenterHigh: WebGLUniformLocation | null
    /** Remaining camera center precision in map units, subtracted separately. */
    cameraCenterLow: WebGLUniformLocation | null
    /** Column-major 2x2 map-to-backing-pixel transform, including rotation. */
    mapToDevicePixels: WebGLUniformLocation | null
    /** Backing pixels per map unit; cancels zoom when expanding strokes. */
    pixelsPerMapUnit: WebGLUniformLocation | null
    /** Normalized RGBA color, premultiplied by the fragment shader. */
    strokeColor: WebGLUniformLocation | null
    /** Canvas lineWidth in backing pixels; intentionally independent of zoom. */
    strokeWidth: WebGLUniformLocation | null
    /** Canvas backing width/height in physical pixels, not CSS pixels. */
    viewportSize: WebGLUniformLocation | null
  }
  /** Layout shared with the mesh packer, with locations resolved for this program. */
  vertexAttributes: ((typeof VERTEX_ATTRIBUTES)[number] & {
    /** Program-specific input location, rebound before drawing each frame. */
    location: number
  })[]
  /** Single buffer containing the ordered visible scene; renderer replaces its data as needed. */
  vertexBuffer: WebGLBuffer
}

const vertexShaderSource = `#version 300 es
in vec2 positionHigh;
in vec2 positionLow;
in vec2 strokeOffset;

uniform vec2 viewportSize;
uniform vec2 cameraCenterHigh;
uniform vec2 cameraCenterLow;
uniform mat2 mapToDevicePixels;
uniform float pixelsPerMapUnit;
uniform float strokeWidth;

void main() {
  // Subtract before combining the two coordinate parts to retain zoom precision.
  vec2 relativePosition = (positionHigh - cameraCenterHigh)
    + (positionLow - cameraCenterLow);
  // Rotate the unit-width offsets with the map, but cancel zoom's scale. The
  // supplied width is already in backing pixels, just like Canvas lineWidth.
  // Interior vertices have zero offsets and therefore need no separate shader.
  vec2 strokeOffsetInPixels = mapToDevicePixels * strokeOffset
    * strokeWidth / pixelsPerMapUnit;
  vec2 pixelPosition = mapToDevicePixels * relativePosition
    + viewportSize * 0.5 + strokeOffsetInPixels;

  // Canvas pixels start at the top left; clip space spans -1 to 1 with Y up.
  vec2 clipPosition = vec2(
    pixelPosition.x * 2.0 / viewportSize.x - 1.0,
    1.0 - pixelPosition.y * 2.0 / viewportSize.y
  );
  gl_Position = vec4(clipPosition, 0.0, 1.0);
}`

const fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec4 strokeColor;
out vec4 outputColor;

void main() {
  // The canvas and destination-over blending both expect premultiplied alpha.
  outputColor = vec4(strokeColor.rgb * strokeColor.a, strokeColor.a);
}`

export const createHardwareContext = (canvas: HTMLCanvasElement): WebGL2RenderingContext => {
  // Transparency lets imagery show through; stencil provides the cumulative
  // interior clip. Depth is unnecessary for ordered 2D drawing. Request browser
  // antialiasing for movement; exact settled edge pixels still come from Canvas.
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: true,
    depth: false,
    premultipliedAlpha: true,
    stencil: true
  })
  if (!gl) throw new Error('WebGL2 is unavailable')

  try {
    if (!gl.getContextAttributes()?.stencil) throw new Error('WebGL stencil buffer is unavailable')

    const rendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const rendererParameter = rendererInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER
    const rendererName = String(gl.getParameter(rendererParameter))
    // Known software renderers are slower than Canvas for these polygons. Debug
    // renderer info is optional; fall back to the public name when unavailable.
    if (/swiftshader|llvmpipe|software rasterizer/i.test(rendererName)) {
      throw new Error('Hardware WebGL is unavailable')
    }

    return gl
  } catch (error) {
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    throw error
  }
}

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create outline shader')

  try {
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Outline shader compilation failed')
    }

    return shader
  } catch (error) {
    gl.deleteShader(shader)
    throw error
  }
}

// Construct everything together so a partial failure releases its allocations.
// The renderer owns the returned buffer/program; context restoration calls this
// again because locations and handles cannot be reused across a lost context.
export const createOutlineResources = (gl: WebGL2RenderingContext): OutlineResources => {
  const shaders: WebGLShader[] = []
  let program: WebGLProgram | null = null
  let vertexBuffer: WebGLBuffer | null = null

  try {
    shaders.push(compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource))
    shaders.push(compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource))
    program = gl.createProgram()
    if (!program) throw new Error('Could not create outline program')

    const linkedProgram = program
    shaders.forEach((shader) => gl.attachShader(linkedProgram, shader))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Outline link failed')

    vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) throw new Error('Could not create outline vertex buffer')

    return {
      program,
      uniforms: {
        cameraCenterHigh: gl.getUniformLocation(program, 'cameraCenterHigh'),
        cameraCenterLow: gl.getUniformLocation(program, 'cameraCenterLow'),
        mapToDevicePixels: gl.getUniformLocation(program, 'mapToDevicePixels'),
        pixelsPerMapUnit: gl.getUniformLocation(program, 'pixelsPerMapUnit'),
        strokeColor: gl.getUniformLocation(program, 'strokeColor'),
        strokeWidth: gl.getUniformLocation(program, 'strokeWidth'),
        viewportSize: gl.getUniformLocation(program, 'viewportSize')
      },
      vertexAttributes: VERTEX_ATTRIBUTES.map((attribute) => ({
        ...attribute,
        location: gl.getAttribLocation(linkedProgram, attribute.name)
      })),
      vertexBuffer
    }
  } catch (error) {
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer)
    if (program) gl.deleteProgram(program)
    throw error
  } finally {
    // No further shader compilation is needed. Mark attached shaders for deletion;
    // WebGL keeps them alive until the owning program is deleted/detached.
    shaders.forEach((shader) => gl.deleteShader(shader))
  }
}
