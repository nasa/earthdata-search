import { layerPickerEventActions } from '../../constants/metricsEventActions'
import { layerPickerEventTypes } from '../../constants/metricsEventTypes'

const { dataLayer = [] } = window

type LayerPickerEventType = typeof layerPickerEventTypes[keyof typeof layerPickerEventTypes]
type LayerPickerEventAction = typeof layerPickerEventActions[keyof typeof layerPickerEventActions]
type LayerPickerAdjustOpacityData = {
  collectionConceptId: string
  productName: string
  opacity: number
}

type LayerPickerReorderLayerData = {
  collectionId: string
  layerOrder: string[]
  movedProduct: string
  oldIndex: number
  newIndex: number
}

type LayerPickerToggleLayerData = {
  collectionId: string
  productName: string
}

type LayerPickerToggleLayerPickerData = {
  layersHidden: boolean
}

type LayerPickerEventData =
  | LayerPickerAdjustOpacityData
  | LayerPickerReorderLayerData
  | LayerPickerToggleLayerData
  | LayerPickerToggleLayerPickerData

/**
 * Pushes a LayerPicker event on the dataLayer.
 * This event is fired when a user drags and drops layers in the LayerPicker
 * @param {string} eventType - The type of event (e.g., 'drag', 'click')
 * @param {string} eventAction - The specific action taken (e.g., 'reorder', 'toggle')
 * @param {object} eventData - Additional data related to the event.
*/
export const metricsLayerPicker = (
  eventType: LayerPickerEventType,
  eventAction: LayerPickerEventAction,
  eventData: LayerPickerEventData
) => {
  dataLayer.push({
    event: 'LayerPicker',
    LayerPickerEventType: eventType,
    LayerPickerEventAction: eventAction,
    LayerPickerEventData: eventData
  })
}
