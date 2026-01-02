import { metricsSpatialSelection } from '../metricsSpatialSelection'

describe('metricsSpatialSelection', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsSpatialSelection('rectangle')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'spatialSelection',
      spatialSelectionCategory: 'Spatial Selection',
      spatialSelectionEventLabel: 'rectangle'
    })
  })
})
