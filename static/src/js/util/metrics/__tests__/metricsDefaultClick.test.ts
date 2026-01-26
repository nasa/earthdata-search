import { metricsDefaultClick } from '../metricsDefaultClick'

describe('metricsDefaultClick', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsDefaultClick('Submit Button')

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'defaultClick',
      defaultClickCategory: 'button',
      defaultClickAction: 'click',
      defaultClickLabel: 'Submit Button'
    })
  })
})
