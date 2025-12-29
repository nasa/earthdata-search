const { dataLayer = [] } = window

/**
* Pushes a map event on the dataLayer.
* This event is fired when a user interacts with the map
* @param {string} eventLabel - The label for the map event.
*/
export const metricsMap = (eventLabel: string) => {
  dataLayer.push({
    event: 'map',
    mapEventCategory: 'button',
    mapEventAction: 'click',
    mapEventLabel: `Map ${eventLabel}`
  })
}
