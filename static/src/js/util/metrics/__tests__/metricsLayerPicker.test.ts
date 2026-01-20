import { metricsLayerPicker } from '../metricsLayerPicker'

describe('metricsLayerPicker', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsLayerPicker('drag', 'reorder', {
      initialOrder: ['A', 'B', 'C'],
      finalOrder: ['B', 'A', 'C'],
      movedProduct: 'B',
      fromIndex: 1,
      toIndex: 0
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'LayerPicker',
      LayerPickerReorderingEventType: 'drag',
      LayerPickerReorderingEventAction: 'reorder',
      LayerPickerReorderingEventData: {
        initialOrder: ['A', 'B', 'C'],
        finalOrder: ['B', 'A', 'C'],
        movedProduct: 'B',
        fromIndex: 1,
        toIndex: 0
      }
    })
  })
})
