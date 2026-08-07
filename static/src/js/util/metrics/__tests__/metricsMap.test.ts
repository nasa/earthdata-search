import { metricsMapButtons } from '../metricsMap'

describe('metricsMap', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsMapButtons('Zoom')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'map',
      mapEventCategory: 'button',
      mapEventAction: 'click',
      mapEventLabel: 'Map Zoom'
    })
  })
})
