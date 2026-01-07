const { dataLayer = [] } = window

/**
* Pushes a timeline event on the dataLayer.
* This event is fired when a user interacts with the timeline
* @param {string} eventLabel - The label for the timeline event.
*/
export const metricsTimeline = (eventLabel: string) => {
  dataLayer.push({
    event: 'timeline',
    timelineEventCategory: 'button',
    timelineEventAction: 'click',
    timelineEventLabel: `Timeline ${eventLabel}`
  })
}
