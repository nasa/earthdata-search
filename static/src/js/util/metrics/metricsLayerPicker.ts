const { dataLayer = [] } = window

/**
* Pushes a LayerPickerReordering event on the dataLayer.
* This event is fired when a user drags and drops layers in the LayerPicker
 * @param {string} eventType - The type of event (e.g., 'drag', 'click')
 * @param {string} eventAction - The specific action taken (e.g., 'reorder', 'toggle')
 * @param {object} eventData - Additional data related to the event.
*/

export const metricsLayerPicker = (
  eventType: string,
  eventAction: string,
  eventData: object
) => {
  dataLayer.push({
    event: 'LayerPicker',
    LayerPickerReorderingEventType: eventType,
    LayerPickerReorderingEventAction: eventAction,
    LayerPickerReorderingEventData: eventData
  })
}
