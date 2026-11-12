import React from 'react'
import OlMap from 'ol/Map'
import RenderEvent from 'ol/render/Event'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import Map from '../Map'
import projectionCodes from '../../../constants/projectionCodes'
import drawGranuleOutlines from '../../../util/map/drawGranuleOutlines'
import useEdscStore from '../../../zustand/useEdscStore'

// Keep real OpenLayers maps and layers, but omit UI controls and remote basemaps.
vi.mock('../LegendControl/LegendControl', async () => {
  const { default: Control } = await import('ol/control/Control')

  return {
    default: class extends Control {
      update = vi.fn()

      constructor() {
        super({ element: document.createElement('div') })
      }
    }
  }
})

vi.mock('../MapControls', async () => ({
  default: (await import('../LegendControl/LegendControl')).default
}))

vi.mock('../../../util/map/layers/worldImagery', () => ({ default: () => null }))
vi.mock('../../../util/map/layers/trueColor', () => ({ default: () => null }))
vi.mock('../../../util/map/layers/landWaterMap', () => ({ default: async () => null }))
vi.mock('../../../util/map/layers/bordersRoads', () => ({ default: () => null }))
vi.mock('../../../util/map/layers/coastlines', () => ({ default: () => null }))
vi.mock('../../../util/map/layers/placeLabels', () => ({ default: async () => null }))
vi.mock('../../../util/map/drawGranuleOutlines', () => ({ default: vi.fn() }))

const getProps = (): React.ComponentProps<typeof Map> => ({
  base: {
    worldImagery: false,
    trueColor: false,
    landWaterMap: false
  },
  center: {
    latitude: 0,
    longitude: 0
  },
  centerMapOnLoad: false,
  focusedCollectionId: '',
  focusedGranuleId: '',
  gibsLayersByCollection: {},
  granules: [],
  granulesKey: '',
  imageryLayers: {
    layerData: [],
    setLayerOpacity: vi.fn(),
    setMapLayersOrder: vi.fn(),
    toggleLayerVisibility: vi.fn()
  },
  isFocusedCollectionPage: false,
  isProjectPage: false,
  onCenterMapOnLoadComplete: vi.fn(),
  onChangeMap: vi.fn(),
  onChangeProjection: vi.fn(),
  onChangeQuery: vi.fn(),
  onClearShapefile: vi.fn(),
  onDrawEnd: vi.fn(),
  onExcludeGranule: vi.fn(),
  onMapReady: vi.fn(),
  onToggleDrawingNewLayer: vi.fn(),
  onToggleShapefileUploadModal: vi.fn(),
  onToggleTooManyPointsModal: vi.fn(),
  onUpdateShapefile: vi.fn(),
  overlays: {
    bordersRoads: false,
    coastlines: false,
    placeLabels: false
  },
  projectCollections: { allIds: [] },
  projectionCode: projectionCodes.geographic,
  rotation: 0,
  setGranuleId: vi.fn(),
  shapefile: useEdscStore.getState().shapefile,
  spatialSearch: {
    drawingNewLayer: false,
    showMbr: false
  },
  zoom: 2
})

const setup = () => {
  const mapSpy = vi.spyOn(OlMap.prototype, 'getView')
  const mapCalls = mapSpy.mock.calls.length
  const props = getProps()
  const view = setupTest({
    Component: Map,
    defaultProps: { ...props }
  })()
  const map = mapSpy.mock.contexts[mapCalls] as OlMap
  const outlineLayer = map.getLayers().getArray().find(
    (layer) => layer.getClassName() === 'map__granules-outlines-layer'
  )!
  const ctx = {} as CanvasRenderingContext2D
  const draw = () => outlineLayer.dispatchEvent(
    new RenderEvent('postrender', undefined, undefined, ctx)
  )

  return {
    ...view,
    ctx,
    draw,
    map,
    outlineLayer,
    props,
    mapSpy
  }
}

describe('Map granule outline callbacks', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('draws once per frame after repeated React rerenders', () => {
    const {
      ctx, draw, map, props, rerender
    } = setup()

    rerender(<Map {...props} focusedGranuleId="G1" />)
    rerender(<Map {...props} focusedGranuleId="G2" />)
    rerender(<Map {...props} focusedGranuleId="G3" />)
    draw()

    expect(drawGranuleOutlines).toHaveBeenCalledTimes(1)
    expect(drawGranuleOutlines).toHaveBeenCalledWith({
      ctx,
      granuleBackgroundsSource: expect.any(Object),
      map
    })
  })

  test('replaces the callback when the projection recreates the map', () => {
    const {
      draw, map, mapSpy, outlineLayer, props, rerender
    } = setup()

    rerender(<Map {...props} projectionCode={projectionCodes.arctic} />)
    rerender(<Map {...props} projectionCode={projectionCodes.antarctic} />)
    const currentMap = mapSpy.mock.contexts.slice().reverse().find(
      (value) => value !== map
    ) as OlMap

    expect(currentMap.getLayers().getArray()).toContain(outlineLayer)
    draw()

    expect(drawGranuleOutlines).toHaveBeenCalledTimes(1)
    expect(drawGranuleOutlines).toHaveBeenLastCalledWith(
      expect.objectContaining({ map: currentMap })
    )
  })

  test('removes callbacks on unmount and registers one on remount', () => {
    const first = setup()
    first.unmount()
    first.draw()
    expect(drawGranuleOutlines).toHaveBeenCalledTimes(0)

    const second = setup()
    second.draw()
    expect(drawGranuleOutlines).toHaveBeenCalledTimes(1)
    second.unmount()
    second.draw()
    expect(drawGranuleOutlines).toHaveBeenCalledTimes(1)
  })
})
