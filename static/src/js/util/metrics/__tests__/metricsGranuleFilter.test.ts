import { metricsGranuleFilter } from '../metricsGranuleFilter'

describe('metricsGranuleFilter', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsGranuleFilter({
      type: 'temporal',
      value: '2020-01-01T00:00:00Z'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'granuleFilter',
      granuleFilterCategory: 'Granule Filter',
      granuleFilterEventAction: 'temporal',
      granuleFilterEventValue: '2020-01-01T00:00:00Z'
    })
  })
})
