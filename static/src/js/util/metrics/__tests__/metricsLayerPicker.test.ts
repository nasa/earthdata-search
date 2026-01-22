import { metricsLayerPicker } from '../metricsLayerPicker'

import { layerPickerEventActions } from '../../../constants/metricsEventActions'
import { layerPickerEventTypes } from '../../../constants/metricsEventTypes'

describe('metricsLayerPicker', () => {
  test('pushes the correct event to the dataLayer', () => {
    const dataLayerPushSpy = vi.spyOn(window.dataLayer, 'push')

    metricsLayerPicker(layerPickerEventTypes.DRAG, layerPickerEventActions.REORDER_LAYER, {
      collectionId: 'Collection-Id',
      layerOrder: ['B', 'A', 'C'],
      movedProduct: 'B',
      oldIndex: 1,
      newIndex: 0
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      event: 'LayerPicker',
      LayerPickerEventType: 'drag',
      LayerPickerEventAction: 'layerPicker.reorderLayer',
      LayerPickerEventData: {
        collectionId: 'Collection-Id',
        layerOrder: ['B', 'A', 'C'],
        movedProduct: 'B',
        oldIndex: 1,
        newIndex: 0
      }
    })
  })
})
