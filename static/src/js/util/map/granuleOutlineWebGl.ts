import { VERTEX_ATTRIBUTES } from './granuleOutlineMesh'

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
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    stencil: true,
    depth: false,
    antialias: true
  })
  if (!gl) throw new Error('WebGL2 is unavailable')

  try {
    if (!gl.getContextAttributes()?.stencil) throw new Error('WebGL stencil buffer is unavailable')

    const rendererInfo = gl.getExtension('WEBGL_debug_renderer_info')
    const rendererParameter = rendererInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER
    const rendererName = String(gl.getParameter(rendererParameter))
    // Software WebGL is slower than Canvas for these polygons.
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

export const createOutlineResources = (gl: WebGL2RenderingContext) => {
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
      vertexBuffer,
      vertexAttributes: VERTEX_ATTRIBUTES.map((attribute) => ({
        ...attribute,
        location: gl.getAttribLocation(linkedProgram, attribute.name)
      })),
      uniforms: {
        viewportSize: gl.getUniformLocation(program, 'viewportSize'),
        cameraCenterHigh: gl.getUniformLocation(program, 'cameraCenterHigh'),
        cameraCenterLow: gl.getUniformLocation(program, 'cameraCenterLow'),
        mapToDevicePixels: gl.getUniformLocation(program, 'mapToDevicePixels'),
        pixelsPerMapUnit: gl.getUniformLocation(program, 'pixelsPerMapUnit'),
        strokeWidth: gl.getUniformLocation(program, 'strokeWidth'),
        strokeColor: gl.getUniformLocation(program, 'strokeColor')
      }
    }
  } catch (error) {
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer)
    if (program) gl.deleteProgram(program)
    throw error
  } finally {
    // Linking copies shader code into the program; the shader objects can go.
    shaders.forEach((shader) => gl.deleteShader(shader))
  }
}

export type OutlineResources = ReturnType<typeof createOutlineResources>
