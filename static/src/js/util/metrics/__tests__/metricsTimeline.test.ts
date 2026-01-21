import { metricsTimeline } from '../metricsTimeline'

describe('metricsTimeline', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsTimeline('Click Label')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'timeline',
      timelineEventCategory: 'button',
      timelineEventAction: 'click',
      timelineEventLabel: 'Timeline Click Label'
    })
  })
})
