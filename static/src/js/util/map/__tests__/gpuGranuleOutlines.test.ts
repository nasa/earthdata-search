import { Map } from 'ol'
import Feature from 'ol/Feature'
import { MultiPolygon } from 'ol/geom'
import VectorSource from 'ol/source/Vector'
import {
  Fill,
  Stroke,
  Style
} from 'ol/style'

import drawGpuGranuleOutlines, {
  disposeGpuGranuleOutlines,
  fillTriangles,
  geometryMesh,
  hideGpuGranuleOutlines,
  strokeTriangles
} from '../gpuGranuleOutlines'

const exterior = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]
const hole = [[2, 2], [2, 8], [8, 8], [8, 2], [2, 2]]

const triangleArea = (vertices: number[]) => {
  let area = 0
  for (let i = 0; i < vertices.length; i += 6) {
    const [ax, ay, bx, by, cx, cy] = vertices.slice(i, i + 6)
    area += Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) / 2
  }

  return area
}

const createScene = ({
  count = 12,
  projection = 'EPSG:4326',
  strokeColor = 'rgb(255, 255, 255)'
} = {}) => {
  const source = new VectorSource()
  source.addFeatures(Array.from({ length: count }, (_, index) => {
    const feature = new Feature(new MultiPolygon([[exterior.map(([x, y]) => [x + index * 20, y])]]))
    feature.set('index', index)
    feature.set('granuleStyle', new Style({
      fill: new Fill({ color: 'transparent' }),
      stroke: new Stroke({
        color: strokeColor,
        width: 1
      })
    }))

    return feature
  }))

  const map = {
    getView: () => ({
      getProjection: () => ({ getCode: () => projection }),
      calculateExtent: () => [-1000, -1000, 1000, 1000]
    }),
    getSize: () => [100, 100]
  } as unknown as Map

  const canvas = document.createElement('canvas')
  canvas.width = 100
  canvas.height = 100
  document.body.appendChild(canvas)

  return {
    ctx: { canvas } as unknown as CanvasRenderingContext2D,
    map,
    granuleBackgroundsSource: source,
    matrix: [1, 0, 0, -1, 50, 50]
  }
}

const setup = (options = {}) => drawGpuGranuleOutlines(createScene(options))

// Jsdom has no GPU. Stub the WebGL boundary to exercise uploads, drawing, and
// Canvas visibility through the public renderer API.
const mockWebGl = () => {
  const gl = {
    MAX_RENDERBUFFER_SIZE: 0x84E8,
    RENDERER: 0x1F01,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88E4,
    TRIANGLES: 0x0004,
    getContextAttributes: vi.fn(() => ({ stencil: true })),
    getExtension: vi.fn(() => null),
    getParameter: vi.fn((parameter) => (parameter === 0x84E8 ? 4096 : 'Hardware renderer')),
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    createBuffer: vi.fn(() => ({})),
    getAttribLocation: vi.fn(() => 0),
    getUniformLocation: vi.fn((_program, name) => ({ name })),
    deleteShader: vi.fn(),
    deleteProgram: vi.fn(),
    deleteBuffer: vi.fn(),
    isContextLost: vi.fn(() => false),
    viewport: vi.fn(),
    useProgram: vi.fn(),
    bindBuffer: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    bufferData: vi.fn(),
    disable: vi.fn(),
    enable: vi.fn(),
    stencilMask: vi.fn(),
    clearStencil: vi.fn(),
    clearColor: vi.fn(),
    colorMask: vi.fn(),
    clear: vi.fn(),
    uniform2f: vi.fn(),
    uniformMatrix2fv: vi.fn(),
    uniform1f: vi.fn(),
    uniform4f: vi.fn(),
    blendFuncSeparate: vi.fn(),
    stencilFunc: vi.fn(),
    stencilOp: vi.fn(),
    drawArrays: vi.fn()
  }
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(gl as unknown as WebGL2RenderingContext)

  return {
    gl,
    getContext
  }
}

describe('gpuGranuleOutlines', () => {
  describe('fillTriangles', () => {
    test('preserves holes and disjoint polygon area', () => {
      const second = exterior.map(([x, y]) => [x + 20, y])
      const geometry = new MultiPolygon([[exterior, hole], [second]])

      expect(triangleArea(fillTriangles(geometry))).toBeCloseTo(164, 10)
    })
  })

  describe('geometryMesh', () => {
    test('rebuilds the cached stroke and fill mesh when the geometry changes in place', () => {
      const geometry = new MultiPolygon([[exterior]])
      const before = geometryMesh(geometry)

      expect(geometryMesh(geometry)).toBe(before)

      geometry.setCoordinates([[exterior, hole]])
      const after = geometryMesh(geometry)

      expect(after).not.toBe(before)
      expect(after.strokeCount).toBeGreaterThan(before.strokeCount)
      expect(after.fillCount).toBeGreaterThan(before.fillCount)
      expect(triangleArea(fillTriangles(geometry))).toBeCloseTo(64, 10)
    })
  })

  describe('strokeTriangles', () => {
    test('preserves miter corners and ignores duplicate ring vertices', () => {
      const ring = exterior as [number, number][]
      const triangles = strokeTriangles(ring, 2)

      expect(strokeTriangles([ring[0], ...ring], 2)).toEqual(triangles)

      const xs = triangles.filter((_, i) => i % 2 === 0)
      const ys = triangles.filter((_, i) => i % 2 === 1)

      expect([Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)])
        .toEqual([-1, 11, -1, 11])

      expect(triangles.every(Number.isFinite)).toBe(true)
    })

    test('uses finite bevels past the Canvas miter limit', () => {
      const triangles = strokeTriangles([[0, 0], [100, 0], [0, 0.001], [0, 0]], 2)

      expect(triangles.every(Number.isFinite)).toBe(true)
      expect(Math.max(...triangles.filter((_, i) => i % 2 === 0))).toBeLessThan(110)
    })

    test('returns no triangles for degenerate rings', () => {
      expect(strokeTriangles([[0, 0], [0, 0], [0, 0]], 2)).toEqual([])
    })
  })

  describe('drawGpuGranuleOutlines', () => {
    afterEach(() => {
      vi.restoreAllMocks()
      vi.unstubAllGlobals()
      document.body.innerHTML = ''
    })

    test('falls back outside the geographic projection', () => {
      expect(setup({ projection: 'EPSG:3413' })).toBe(false)
    })

    test('falls back when few granules are visible', () => {
      expect(setup({ count: 9 })).toBe(false)
    })

    test('falls back for translucent strokes', () => {
      expect(setup({ strokeColor: 'rgba(255, 255, 255, 0.5)' })).toBe(false)
    })

    test('falls back when WebGL2 is unavailable', () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

      expect(setup()).toBe(false)
    })

    test.each(['getShaderParameter', 'getProgramParameter'] as const)(
      'falls back and releases shaders when %s rejects the program',
      (statusCheck) => {
        const { gl, getContext } = mockWebGl()
        gl[statusCheck].mockReturnValue(false)
        const scene = createScene()

        expect(drawGpuGranuleOutlines(scene)).toBe(false)
        expect(scene.ctx.canvas.style.visibility).toBe('')
        expect(gl.drawArrays).not.toHaveBeenCalled()
        expect(gl.deleteShader).toHaveBeenCalled()
        if (statusCheck === 'getProgramParameter') {
          expect(gl.deleteProgram).toHaveBeenCalledTimes(1)
        }

        // A failed map must keep using Canvas instead of retrying every frame.
        expect(drawGpuGranuleOutlines(scene)).toBe(false)
        expect(getContext).toHaveBeenCalledTimes(1)
        disposeGpuGranuleOutlines(scene.map)
      }
    )

    test('keeps the camera center and stroke scale correct on rotated high-DPI frames', () => {
      const { gl } = mockWebGl()
      const scene = createScene()
      vi.stubGlobal('devicePixelRatio', 2)

      expect(drawGpuGranuleOutlines({
        ...scene,
        matrix: [0, 2, 2, 0, 10, 20]
      })).toBe(true)

      expect(gl.uniform2f).toHaveBeenCalledWith({ name: 'cameraCenterHigh' }, 2.5, 7.5)
      expect(gl.uniformMatrix2fv).toHaveBeenCalledWith({ name: 'mapToDevicePixels' }, false, [0, 4, 4, 0])

      expect(gl.uniform1f).toHaveBeenCalledWith({ name: 'pixelsPerMapUnit' }, 4)
      disposeGpuGranuleOutlines(scene.map)
    })

    test('shows a GPU canvas and restores the original Canvas when hidden or disposed', () => {
      const { gl, getContext } = mockWebGl()
      const scene = createScene()
      const { canvas } = scene.ctx
      canvas.style.visibility = 'inherit'

      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      const gpuCanvas = getContext.mock.contexts[0] as HTMLCanvasElement
      expect(canvas.style.visibility).toBe('hidden')
      expect(gpuCanvas.style.visibility).toBe('visible')
      expect(gpuCanvas.parentElement).toBe(canvas.parentElement)
      expect(gl.drawArrays).toHaveBeenCalledTimes(24)

      hideGpuGranuleOutlines(scene.map)
      expect(canvas.style.visibility).toBe('inherit')
      expect(gpuCanvas.style.visibility).toBe('hidden')

      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      disposeGpuGranuleOutlines(scene.map)
      expect(canvas.style.visibility).toBe('inherit')
      expect(gpuCanvas.isConnected).toBe(false)
      expect(gl.deleteBuffer).toHaveBeenCalledTimes(1)
      expect(gl.deleteProgram).toHaveBeenCalledTimes(1)
    })

    test('reuses uploaded geometry during camera movement and rebuilds it after a shape change', () => {
      const { gl } = mockWebGl()
      const scene = createScene()

      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      expect(gl.bufferData).toHaveBeenCalledTimes(1)

      expect(drawGpuGranuleOutlines({
        ...scene,
        matrix: [2, 0, 0, -2, 40, 60]
      })).toBe(true)

      expect(gl.bufferData).toHaveBeenCalledTimes(1)
      expect(gl.uniformMatrix2fv).toHaveBeenLastCalledWith(
        { name: 'mapToDevicePixels' },
        false,
        [2, 0, 0, -2].map((value) => value * (window.devicePixelRatio || 1))
      )

      const geometry = scene.granuleBackgroundsSource.getFeatures()[0].getGeometry() as MultiPolygon
      geometry.translate(1, 1)
      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      expect(gl.bufferData).toHaveBeenCalledTimes(2)

      disposeGpuGranuleOutlines(scene.map)
    })

    test('restores Canvas on context loss and reuploads geometry after restoration', () => {
      const { gl, getContext } = mockWebGl()
      const scene = createScene()
      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      const gpuCanvas = getContext.mock.contexts[0] as HTMLCanvasElement

      gl.isContextLost.mockReturnValue(true)
      gpuCanvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }))
      expect(scene.ctx.canvas.style.visibility).toBe('')
      expect(drawGpuGranuleOutlines(scene)).toBe(false)

      gl.isContextLost.mockReturnValue(false)
      gpuCanvas.dispatchEvent(new Event('webglcontextrestored'))
      expect(drawGpuGranuleOutlines(scene)).toBe(true)
      expect(gl.bufferData).toHaveBeenCalledTimes(2)

      disposeGpuGranuleOutlines(scene.map)
    })
  })
})
