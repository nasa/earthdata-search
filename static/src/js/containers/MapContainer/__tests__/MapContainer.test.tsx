import React from 'react'

// @ts-expect-error The file does not have types
import actions from '../../../actions'

import { mapDispatchToProps, mapStateToProps } from '../MapContainer'

// @ts-expect-error The file does not have types
import * as metricsMap from '../../../middleware/metrics/actions'

// Mock Map because openlayers causes errors
jest.mock('../../../components/Map/Map', () => <div />)

describe('mapDispatchToProps', () => {
  test('onMetricsMap calls metricsMap', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsMap, 'metricsMap')

    mapDispatchToProps(dispatch).onMetricsMap('mockType')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mockType')
  })

  test('onToggleDrawingNewLayer calls actions.toggleDrawingNewLayer', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleDrawingNewLayer')

    mapDispatchToProps(dispatch).onToggleDrawingNewLayer('point')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('point')
  })

  test('onToggleShapefileUploadModal calls actions.toggleShapefileUploadModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleShapefileUploadModal')

    mapDispatchToProps(dispatch).onToggleShapefileUploadModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

  test('onToggleTooManyPointsModal calls actions.toggleTooManyPointsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleTooManyPointsModal')

    mapDispatchToProps(dispatch).onToggleTooManyPointsModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      router: {},
      ui: {
        map: {
          drawingNewLayer: false
        },
        spatialPolygonWarning: {
          isDisplayed: false
        }
      }
    }

    const expectedState = {
      colormapsMetadata: {},
      displaySpatialPolygonWarning: false,
      drawingNewLayer: false,
      router: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})
