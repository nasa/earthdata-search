import { metricsSpatialEdit } from '../metricsSpatialEdit'

describe('metricsSpatialEdit', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsSpatialEdit({
      distanceSum: 1234.56,
      type: 'polygon'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'spatialEdit',
      spatialEditEventCategory: 'Spatial Edit',
      spatialEditEventAction: 'polygon',
      spatialEditEventLabel: '',
      spatialEditEventValue: 1235
    })
  })
})
