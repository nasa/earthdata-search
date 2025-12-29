import { metricsTemporalFilter } from '../metricsTemporalFilter'

describe('metricsTemporalFilter', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsTemporalFilter({
      type: 'start_date',
      value: '2020-01-01'
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'temporalFilter',
      temporalFilterCategory: 'Temporal Filter',
      temporalFilterEventAction: 'start_date',
      temporalFilterEventValue: '2020-01-01'
    })
  })
})
