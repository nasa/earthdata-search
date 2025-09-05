import routerHelper from '../router/router'
import getObjectKeyByValue from './object'

/**
 * Mapping of timeline zoom levels. The Timeline (sometimes) and URL use numbers, CMR uses words
 */
export const timelineIntervalZooms = {
  minute: 0,
  hour: 1,
  day: 2,
  month: 3,
  year: 4,
  decade: 5
}

/**
 * Determine the zoom level for the timeline based on the difference between the start and end dates
 * @param {String} startDate - The start date
 * @param {String} endDate - The end date
 * @returns {String} - The zoom level
 */
export const zoomLevelDifference = (startDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date()
  const start = new Date(startDate)

  // Calculate the time difference in milliseconds
  const diffMs = end - start

  // Convert to various time units - adjusted for test precision
  const msPerHour = 1000 * 60 * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30.44 // Average month length
  const msPerYear = msPerDay * 365

  // Check thresholds and return appropriate zoom level
  if (diffMs >= msPerYear * 10) return 'decade'
  if (diffMs >= msPerYear) return 'year'
  if (diffMs >= msPerMonth) return 'month'
  if (diffMs >= msPerDay) return 'day'

  return 'hour'
}

/**
 * Prepare parameters used in getTimeline() based on current Redux State
 * @param {Object} state Current Redux State
 * @returns Parameters used in Timeline request
 */
export const prepareTimelineParams = (state) => {
  const {
    authToken,
    collectionQuery,
    focusedCollection,
    projectCollections,
    timelineQuery
  } = state

  const { location } = routerHelper.router.state
  const { pathname } = location
  const isProjectPage = pathname.startsWith('/project')

  let conceptIds = []

  // If we are on the project page, we want to query the projectIds
  if (isProjectPage) {
    const { allIds: projectIds } = projectCollections

    conceptIds = projectIds
  } else if (focusedCollection && focusedCollection !== '') {
    // If we aren't on the project page, we want to query the focusedCollection
    conceptIds.push(focusedCollection)
  }

  // If we don't have any conceptIds, bail out!
  if (conceptIds.length === 0) {
    return null
  }

  const { spatial } = collectionQuery
  const {
    boundingBox,
    point,
    polygon
  } = spatial

  const {
    endDate,
    startDate
  } = timelineQuery

  let { interval } = timelineQuery
  // Use one level lower than current interval when requesting timeline from CMR
  // I.e., request day intervals when viewing the timeline at the month level
  const index = timelineIntervalZooms[interval]
  interval = getObjectKeyByValue(timelineIntervalZooms, (index - 1))

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

/**
 * Calculate the zoom level and initial center for the timeline based on collection metadata
 * @param {Object} collectionMetadata - The metadata for the collections
 * @param {String} collectionConceptId - The concept id of the collection
 * @param {Boolean} isProjectPage - Whether or not the page is a project page
 * @param {Array} projectCollectionsIds - The concept ids of the collections in the project
 * @param {Date} currentDate - The current date
 * @returns {Object} - Object containing zoomLevel and initialCenter
 */
export const calculateTimelineParams = ({
  isProjectPage,
  projectCollectionsIds,
  collectionMetadata,
  collectionConceptId,
  currentDate
}) => {
  let timeStart
  let timeEnd

  if (isProjectPage && projectCollectionsIds.length > 0) {
    const startDates = []
    const endDates = []

    projectCollectionsIds.forEach((conceptId) => {
      const metadata = collectionMetadata[conceptId]
      startDates.push(metadata?.timeStart
        ? new Date(metadata.timeStart).getTime()
        : currentDate - (24 * 60 * 60 * 1000))

      endDates.push(metadata?.timeEnd
        ? new Date(metadata.timeEnd).getTime()
        : currentDate)
    })

    if (startDates.length && endDates.length) {
      timeStart = Math.min(...startDates)
      timeEnd = Math.max(...endDates)
    }
  } else {
    const metadata = collectionMetadata[collectionConceptId]
    timeStart = metadata?.timeStart
      ? new Date(metadata.timeStart).getTime()
      : currentDate - (24 * 60 * 60 * 1000)

    timeEnd = metadata?.timeEnd
      ? new Date(metadata.timeEnd).getTime()
      : currentDate
  }

  let calculatedInterval
  if (timeStart && timeEnd) {
    calculatedInterval = zoomLevelDifference(timeStart, timeEnd)
  }

  return {
    zoomLevel: timelineIntervalZooms[calculatedInterval]
      ? timelineIntervalZooms[calculatedInterval]
      : timelineIntervalZooms.decade,
    initialCenter: timeStart && timeEnd
      ? (timeStart + timeEnd) / 2
      : currentDate
  }
}
