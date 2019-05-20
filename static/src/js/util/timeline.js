/**
 * Mapping of timeline zoom levels. The Timeline (sometimes) and URL use numbers, CMR uses words
 */
export const timelineIntervals = {
  minute: '2',
  hour: '3',
  day: '4',
  month: '5',
  year: '6'
}

/**
 * Prepare parameters used in getTimeline() based on current Redux State
 * @param {object} state Current Redux State
 * @returns Parameters used in Timeline request
 */
export const prepareTimelineParams = (state) => {
  const {
    authToken,
    focusedCollection,
    query,
    timeline
  } = state

  // If we don't have a focusedCollection, bail out!
  const { collectionId } = focusedCollection
  if (!collectionId) {
    return null
  }

  const { collection: collectionQuery } = query
  const { spatial } = collectionQuery
  const {
    boundingBox,
    point,
    polygon
  } = spatial

  const { query: timelineQuery } = timeline
  const {
    endDate,
    interval,
    startDate
  } = timelineQuery

  return {
    authToken,
    boundingBox,
    collectionId,
    endDate,
    interval,
    point,
    polygon,
    startDate
  }
}
