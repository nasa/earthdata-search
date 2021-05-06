import getObjectKeyByValue from './object'

/**
 * Mapping of timeline zoom levels. The Timeline (sometimes) and URL use numbers, CMR uses words
 */
export const timelineIntervals = {
  minute: '0',
  hour: '1',
  day: '2',
  month: '3',
  year: '4',
  decade: '5'
}

/**
 * Prepare parameters used in getTimeline() based on current Redux State
 * @param {Object} state Current Redux State
 * @returns Parameters used in Timeline request
 */
export const prepareTimelineParams = (state) => {
  const {
    authToken,
    focusedCollection,
    project,
    query,
    router,
    timeline
  } = state

  const { location } = router
  const { pathname } = location
  const isProjectPage = pathname.startsWith('/project')

  let conceptIds = []

  // If we are on the project page, we want to query the projectIds
  if (isProjectPage) {
    const { collections: projectCollections } = project
    const { allIds: projectIds } = projectCollections

    conceptIds = projectIds
  } else if (focusedCollection !== '') {
    // if we aren't on the project page, we want to query the focusedCollection
    conceptIds.push(focusedCollection)
  }

  // If we don't have any conceptIds, bail out!
  if (conceptIds.length === 0) {
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
    startDate
  } = timelineQuery

  let { interval } = timelineQuery
  // Use one level lower than current interval when requesting timeline from CMR
  // I.e., request day intervals when viewing the timeline at the month level
  const index = parseInt(timelineIntervals[interval], 10)
  interval = getObjectKeyByValue(timelineIntervals, (index - 1).toString())

  if (!startDate) {
    return null
  }

  return {
    authToken,
    boundingBox,
    conceptId: conceptIds,
    endDate,
    interval,
    point,
    polygon,
    startDate
  }
}
