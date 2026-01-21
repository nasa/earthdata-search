import { metricsLayerPicker } from '../metricsLayerPicker'

import { layerPickerEventActions } from '../../../constants/metricsEventActions'
import { layerPickerEventTypes } from '../../../constants/metricsEventTypes'

describe('metricsLayerPicker', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsLayerPicker(layerPickerEventTypes.DRAG, layerPickerEventActions.REORDER_LAYER, {
      initialOrder: ['A', 'B', 'C'],
      finalOrder: ['B', 'A', 'C'],
      movedProduct: 'B',
      fromIndex: 1,
      toIndex: 0
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'LayerPicker',
      LayerPickerEventType: 'drag',
      LayerPickerEventAction: 'layerPicker.reorderLayer',
      LayerPickerEventData: {
        initialOrder: ['A', 'B', 'C'],
        finalOrder: ['B', 'A', 'C'],
        movedProduct: 'B',
        fromIndex: 1,
        toIndex: 0
      }
    })
  })
})
