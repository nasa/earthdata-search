/* eslint-disable new-cap, no-underscore-dangle */

import L from 'leaflet'
import * as EventEmitter from '../../../events/events'
import crsProjections from '../../../util/map/crs'
import * as LayerUtils from '../../../util/map/layers'

import { GranuleGridLayerExtended } from '../GranuleGridLayerExtended'

import { pathsResult, pathsWithHolesResult, updateProps } from './mocks'

function setup(overrideProps = {}) {
  const layer = new GranuleGridLayerExtended({
    collectionId: 'C194001241-LPDAAC_ECS',
    color: '#2ECC71',
    drawingNewLayer: false,
    focusedCollectionId: 'C194001241-LPDAAC_ECS',
    focusedGranuleId: '',
    granules: [],
    isProjectPage: false,
    metadata: {},
    project: {
      collections: {
        allIds: [],
        byId: {}
      },
      isSubmitted: false,
      isSubmitting: false
    },
    projection: 'epsg4326',
    ...overrideProps
  })

  return layer
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('GranuleGridLayerExtended class', () => {
  describe('onAdd', () => {
    test('calls setAttribute and setFocus', () => {
      const element = document.createElement('div')
      element.id = 'map'
      document.body.appendChild(element)
      const map = new L.map('map', {
        center: [0, 0],
        zoom: 0,
        crs: crsProjections.epsg4326
      })

      const layer = setup()

      const setAttributeMock = jest.fn()
      const superMock = jest.spyOn(L.GridLayer.prototype, 'onAdd').mockImplementation(() => {})
      layer._container = {
        setAttribute: setAttributeMock
      }

      const setFocusMock = jest.fn()
      layer.setFocus = setFocusMock

      layer.onAdd(map)

      expect(superMock).toBeCalledTimes(1)
      expect(setAttributeMock).toBeCalledTimes(1)
      expect(setAttributeMock).toBeCalledWith('id', 'granule-vis-C194001241-LPDAAC_ECS')
      expect(setFocusMock).toBeCalledTimes(1)
      expect(setFocusMock).toBeCalledWith('C194001241-LPDAAC_ECS')

      layer.onRemove(map)
      map.remove()
    })
  })

  describe('onRemove', () => {
    test('turns eventEmitters off and sets granules to null', () => {
      const element = document.createElement('div')
      element.id = 'map'
      document.body.appendChild(element)
      const map = new L.map('map', {
        center: [0, 0],
        zoom: 0,
        crs: crsProjections.epsg4326
      })

      const layer = setup()

      const superMock = jest.spyOn(L.GridLayer.prototype, 'onRemove').mockImplementation(() => {})
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'off').mockImplementation(() => {})

      layer.onRemove(map)

      expect(superMock).toBeCalledTimes(1)
      expect(eventEmitterMock).toBeCalledTimes(6)
      expect(eventEmitterMock.mock.calls[0]).toEqual(expect.arrayContaining(['map.mousemove']))
      expect(eventEmitterMock.mock.calls[1]).toEqual(expect.arrayContaining(['map.mouseout']))
      expect(eventEmitterMock.mock.calls[2]).toEqual(expect.arrayContaining(['map.click']))
      expect(eventEmitterMock.mock.calls[3]).toEqual(expect.arrayContaining(['map.layer.C194001241-LPDAAC_ECS.focusgranule']))
      expect(eventEmitterMock.mock.calls[4]).toEqual(expect.arrayContaining(['map.layer.C194001241-LPDAAC_ECS.stickygranule']))
      expect(eventEmitterMock.mock.calls[5]).toEqual(expect.arrayContaining(['map.excludestickygranule']))

      expect(layer.granules).toBeNull()

      map.remove()
    })
  })

  describe('createTile', () => {
    test('returns the tile element', () => {
      const layer = setup()
      const tilePoint = {
        x: 0,
        y: 0,
        z: 0
      }

      const drawTileMock = jest.fn()
      layer.drawTile = drawTileMock

      const result = layer.createTile(tilePoint)

      expect(drawTileMock).toBeCalledTimes(1)

      expect(result.outerHTML).toEqual('<div class="leaflet-tile"><canvas class="leaflet-imagery-tile" width="512" height="512"></canvas><canvas class="leaflet-outline-tile" width="512" height="512"></canvas></div>')
    })
  })

  describe('getTileUrl', () => {
    test('returns a granule URL', () => {
      const layer = setup()
      layer.setResults(updateProps)
      const tilePoint = {
        x: 0,
        y: 0,
        z: 0
      }

      const result = layer.getTileUrl(tilePoint, updateProps.granules[0])
      expect(result).toEqual('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_L3_NDVI_16Day/default/2020-09-29/250m/0/0/0.png')
    })
  })

  describe('drawTile', () => {
    test('calls the draw methods', () => {
      jest.useFakeTimers('legacy')

      const element = document.createElement('div')
      element.id = 'map'
      document.body.appendChild(element)
      const map = new L.map('map', {
        center: [0, 0],
        zoom: 0,
        crs: crsProjections.epsg4326
      })

      const layer = setup()

      layer.onAdd(map)

      layer.redraw = jest.fn()
      layer._onEdscStickygranule = jest.fn()
      const drawClippedPathsMock = jest.fn()
      layer.drawClippedPaths = drawClippedPathsMock
      const drawOutlinesMock = jest.fn()
      layer.drawOutlines = drawOutlinesMock
      const drawClippedImageryMock = jest.fn()
      layer.drawClippedImagery = drawClippedImageryMock
      const drawFullBackTileMock = jest.fn()
      layer.drawFullBackTile = drawFullBackTileMock
      layer.setResults(updateProps)

      const canvases = {
        imagery: layer.setupCanvas(new L.Point(512, 512), 'imagery'),
        outline: layer.setupCanvas(new L.Point(512, 512), 'outline')
      }
      const back = {
        imagery: layer.setupCanvas(new L.Point(512, 512), 'imagery'),
        outline: layer.setupCanvas(new L.Point(512, 512), 'outline')
      }
      const tilePoint = new L.Point(0, 0)
      tilePoint.z = 0

      layer.drawTile(canvases, back, tilePoint)
      jest.advanceTimersByTime(1000)

      const boundary = {
        poly: [
          { x: -320, y: 352 }, { x: 192, y: 352 }, { x: 192, y: -160 }, { x: -320, y: -160 }
        ]
      }
      const nwPoint = { x: -320, y: -160 }
      expect(drawClippedPathsMock).toBeCalledTimes(1)
      expect(drawClippedPathsMock).toBeCalledWith(
        canvases.outline,
        {
          poly: [
            { x: -320, y: 352 }, { x: 192, y: 352 }, { x: 192, y: -160 }, { x: -320, y: -160 }
          ]
        },
        pathsWithHolesResult,
        nwPoint
      )

      expect(drawOutlinesMock).toBeCalledTimes(1)
      expect(drawOutlinesMock).toBeCalledWith(
        canvases.outline,
        pathsResult,
        nwPoint
      )

      expect(drawClippedImageryMock).toBeCalledTimes(1)
      expect(drawClippedImageryMock).toBeCalledWith(
        canvases.imagery,
        boundary,
        pathsResult,
        nwPoint,
        tilePoint
      )

      expect(drawFullBackTileMock).toBeCalledTimes(1)
      expect(drawFullBackTileMock).toBeCalledWith(
        back,
        boundary,
        pathsWithHolesResult.concat().reverse(),
        nwPoint
      )
      jest.useRealTimers()

      layer.onRemove(map)
      map.remove()
    })
  })

  describe('setResults', () => {
    test('calls redraw', () => {
      const layer = setup()

      const redrawMock = jest.fn()
      layer.redraw = redrawMock
      const stickyGranuleMock = jest.fn()
      layer._onEdscStickygranule = stickyGranuleMock
      const setAttributeMock = jest.fn()
      layer._container = {
        setAttribute: setAttributeMock
      }
      const setFocusMock = jest.fn()
      layer.setFocus = setFocusMock

      layer.setResults(updateProps)

      expect(layer.granules).toEqual(updateProps.granules)
      expect(layer.addedGranuleIds).toEqual(updateProps.addedGranuleIds)
      expect(layer.removedGranuleIds).toEqual(updateProps.removedGranuleIds)
      expect(layer.isProjectPage).toEqual(updateProps.isProjectPage)
      expect(layer.collectionId).toEqual(updateProps.collectionId)
      expect(layer.focusedCollectionId).toEqual(updateProps.focusedCollectionId)
      expect(layer.projection).toEqual(updateProps.projection)
      expect(layer.drawingNewLayer).toEqual(updateProps.drawingNewLayer)

      expect(redrawMock).toBeCalledTimes(1)
      expect(setAttributeMock).toBeCalledTimes(1)
      expect(setFocusMock).toBeCalledTimes(1)
      expect(setFocusMock).toBeCalledWith(updateProps.collectionId)
      expect(stickyGranuleMock).toBeCalledTimes(1)
      expect(stickyGranuleMock).toBeCalledWith({ granule: null })
    })

    test('calls this._onEdscStickygranule if there is a focusedGranuleId', () => {
      const layer = setup()

      const redrawMock = jest.fn()
      layer.redraw = redrawMock
      const stickyGranuleMock = jest.fn()
      layer._onEdscStickygranule = stickyGranuleMock

      layer.setResults({
        ...updateProps,
        focusedGranuleId: 'G1953763296-LPDAAC_ECS'
      })

      expect(redrawMock).toBeCalledTimes(1)
      expect(stickyGranuleMock).toBeCalledTimes(1)
      expect(stickyGranuleMock).toBeCalledWith({ granule: updateProps.defaultGranules[0] })
    })
  })

  describe('loadResults', () => {
    describe('without a focused granule', () => {
      test('calls setResults with the default ordering of granules', () => {
        const layer = setup()
        layer.setResults(updateProps)

        const setResultsMock = jest.fn()
        layer.setResults = setResultsMock

        layer.loadResults(updateProps.granules)

        expect(setResultsMock).toBeCalledTimes(1)
        expect(setResultsMock).toBeCalledWith({
          addedGranuleIds: [],
          collectionId: 'C194001241-LPDAAC_ECS',
          color: '#2ECC71',
          drawingNewLayer: false,
          focusedCollectionId: 'C194001241-LPDAAC_ECS',
          focusedGranuleId: undefined,
          granules: updateProps.granules,
          isProjectPage: false,
          lightColor: 'rgb(46, 204, 113, 0.5)',
          removedGranuleIds: []
        })
      })
    })

    describe('with a focused granule', () => {
      test('reorders results and calls setResults', () => {
        const layer = setup()
        layer.setResults(updateProps)
        const [firstGranule] = updateProps.granules
        layer._stickied = firstGranule

        const setResultsMock = jest.fn()
        layer.setResults = setResultsMock

        layer.loadResults(updateProps.granules)

        expect(setResultsMock).toBeCalledTimes(1)
        expect(setResultsMock).toBeCalledWith({
          addedGranuleIds: [],
          collectionId: 'C194001241-LPDAAC_ECS',
          color: '#2ECC71',
          drawingNewLayer: false,
          focusedCollectionId: 'C194001241-LPDAAC_ECS',
          focusedGranuleId: undefined,
          granules: updateProps.granules,
          isProjectPage: false,
          lightColor: 'rgb(46, 204, 113, 0.5)',
          removedGranuleIds: []
        })
      })
    })

    describe('with a focused granule that is no in the results', () => {
      test('reorders results and calls setResults', () => {
        const layer = setup()
        layer.setResults(updateProps)
        layer._stickied = {}

        const setResultsMock = jest.fn()
        layer.setResults = setResultsMock

        layer.loadResults(updateProps.granules)

        expect(setResultsMock).toBeCalledTimes(1)
        expect(setResultsMock).toBeCalledWith({
          addedGranuleIds: [],
          collectionId: 'C194001241-LPDAAC_ECS',
          color: '#2ECC71',
          drawingNewLayer: false,
          focusedCollectionId: 'C194001241-LPDAAC_ECS',
          focusedGranuleId: undefined,
          granules: updateProps.granules,
          isProjectPage: false,
          lightColor: 'rgb(46, 204, 113, 0.5)',
          removedGranuleIds: []
        })
      })
    })
  })

  describe('_onEdscFocuscollection', () => {
    test('calls setFocus', () => {
      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      const setFocusMock = jest.fn()
      layer.setFocus = setFocusMock

      layer._onEdscFocuscollection({
        collection: {
          id: 'C194001241-LPDAAC_ECS'
        }
      })

      expect(setFocusMock).toBeCalledTimes(1)
      expect(setFocusMock).toBeCalledWith(true)
    })
  })

  describe('_onEdscMouseout', () => {
    test('emits an event if this._granule exists', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)
      layer._granule = { mock: 'granule' }
      layer._map = {}

      layer._onEdscMouseout()

      expect(eventEmitterMock).toBeCalledTimes(1)
      expect(eventEmitterMock).toBeCalledWith('map.layer.C194001241-LPDAAC_ECS.focusgranule', { granule: null })
    })

    test('does not emit an event if this._granule does not exist', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}

      layer._onEdscMouseout()

      expect(eventEmitterMock).toBeCalledTimes(0)
    })
  })

  describe('_onEdscMousemove', () => {
    test('emits an event if the granule is new', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onEdscMousemove({
        layerPoint: { mock: 'point' }
      })

      expect(granuleAtMock).toBeCalledTimes(1)
      expect(granuleAtMock).toBeCalledWith({ mock: 'point' })
      expect(eventEmitterMock).toBeCalledTimes(1)
      expect(eventEmitterMock).toBeCalledWith(
        'map.layer.C194001241-LPDAAC_ECS.focusgranule',
        { granule: { mock: 'granule' } }
      )
    })

    test('does not emit an event if the granule is already hovered', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      layer._granule = { mock: 'granule' }
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onEdscMousemove({
        layerPoint: { mock: 'point' }
      })

      expect(granuleAtMock).toBeCalledTimes(1)
      expect(granuleAtMock).toBeCalledWith({ mock: 'point' })
      expect(eventEmitterMock).toBeCalledTimes(0)
    })
  })

  describe('_onClick', () => {
    test('emits an event to exlude the stickied granule', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onClick({
        originalEvent: {
          target: {
            closest: jest.fn().mockImplementation(() => {
              const div = document.createElement('div')
              div.className = 'granule-grid-layer-extended__panel-list-remove'
              div.dataset.granuleId = 'granuleId'
              return div
            })
          }
        }
      })

      expect(eventEmitterMock).toBeCalledTimes(1)
      expect(eventEmitterMock).toBeCalledWith('map.excludestickygranule', 'granuleId')
    })

    test('does not emit an event if the target is inside the map container', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onClick({
        originalEvent: {
          target: {
            closest: jest.fn().mockImplementation(() => {
              const parent = document.createElement('div')
              parent.className = 'map leaflet-container'

              const div = document.createElement('div')

              parent.appendChild(div)
              return div
            })
          }
        }
      })

      expect(eventEmitterMock).toBeCalledTimes(0)
    })

    test('emits an event to set the focused and stickied granule', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onClick({
        originalEvent: {
          target: {
            closest: jest.fn().mockImplementation(() => {
              const div = document.createElement('div')
              return div
            })
          }
        }
      })

      expect(eventEmitterMock).toBeCalledTimes(2)
      expect(eventEmitterMock.mock.calls[0]).toEqual([
        'map.layer.C194001241-LPDAAC_ECS.focusgranule', { granule: { mock: 'granule' } }
      ])
      expect(eventEmitterMock.mock.calls[1]).toEqual([
        'map.layer.C194001241-LPDAAC_ECS.stickygranule', { granule: { mock: 'granule' } }
      ])
    })

    test('emits an event to clear the focused and stickied granule', () => {
      const eventEmitterMock = jest.spyOn(EventEmitter.eventEmitter, 'emit').mockImplementation(() => {})

      const layer = setup()
      layer.setResults(updateProps)

      layer._map = {}
      layer._stickied = { mock: 'granule' }
      const granuleAtMock = jest.fn().mockImplementation(() => ({ mock: 'granule' }))
      layer.granuleAt = granuleAtMock

      layer._onClick({
        originalEvent: {
          target: {
            closest: jest.fn().mockImplementation(() => {
              const div = document.createElement('div')
              return div
            })
          }
        }
      })

      expect(eventEmitterMock).toBeCalledTimes(2)
      expect(eventEmitterMock.mock.calls[0]).toEqual([
        'map.layer.C194001241-LPDAAC_ECS.focusgranule', { granule: null }
      ])
      expect(eventEmitterMock.mock.calls[1]).toEqual([
        'map.layer.C194001241-LPDAAC_ECS.stickygranule', { granule: null }
      ])
    })
  })

  describe('_onExcludeGranule', () => {
    test('calls this.onExcludeGranule', () => {
      const layer = setup()

      const onExcludeGranuleMock = jest.fn()
      layer.onExcludeGranule = onExcludeGranuleMock

      layer._onExcludeGranule('granuleId')

      expect(onExcludeGranuleMock).toBeCalledTimes(1)
      expect(onExcludeGranuleMock).toBeCalledWith({
        collectionId: 'C194001241-LPDAAC_ECS',
        granuleId: 'granuleId'
      })
    })
  })

  describe('_granuleLayer', () => {
    test('calls buildLayer', () => {
      const layer = setup()
      layer.setResults(updateProps)

      const buildLayerMock = jest.spyOn(LayerUtils, 'buildLayer').mockImplementation(() => ('buildLayer Result'))

      const options = {
        mock: 'options'
      }
      layer._granuleLayer(updateProps.granules[0], options)

      expect(buildLayerMock).toBeCalledTimes(1)
      expect(buildLayerMock).toBeCalledWith(
        {
          mock: 'options'
        },
        updateProps.granules[0]
      )
    })
  })

  describe('_focusLayer', () => {
    test('calls buildLayer if a granule is supplied', () => {
      const layer = setup()
      layer.setResults(updateProps)

      const buildLayerMock = jest.spyOn(LayerUtils, 'buildLayer').mockImplementation(() => ('buildLayer Result'))

      layer._focusLayer(updateProps.granules[0])

      expect(buildLayerMock).toBeCalledTimes(1)
      expect(buildLayerMock).toBeCalledWith(
        {
          clickable: false,
          color: layer.color,
          fillColor: layer.color,
          opacity: 1
        },
        updateProps.granules[0]
      )
    })

    test('does not call buildLayer if a granule is not supplied', () => {
      const layer = setup()
      layer.setResults(updateProps)

      const buildLayerMock = jest.spyOn(LayerUtils, 'buildLayer').mockImplementation(() => ('buildLayer Result'))

      layer._focusLayer()

      expect(buildLayerMock).toBeCalledTimes(0)
    })
  })

  // TODO: Untested methods
  describe('drawOutlines', () => {})
  describe('drawClippedPaths', () => {})
  describe('drawClippedImagery', () => {})
  describe('drawClippedImageDeemphisized', () => {})
  describe('drawFullBackTile', () => {})
  describe('loadImage', () => {})
  describe('granuleAt', () => {})
  describe('setFocus', () => {})
  describe('_onEdscFocusgranule', () => {})
  describe('_onEdscStickygranule', () => {})
  describe('_stickyLayer', () => {})
})
