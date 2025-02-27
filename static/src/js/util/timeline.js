import { intervalToDuration } from 'date-fns'
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

export const timelineZoomEnums = {
  decade: 'decade',
  year: 'year',
  month: 'month',
  day: 'day',
  hour: 'hour'
}

export const intervalDurationMappings = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0
}

/**
 * Determine the zoom level for the timeline based on the difference between the start and end dates
 * @param {String} startDate - The start date
 * @param {String} endDate - The end date
 * @returns {String} - The zoom level
 */
export const zoomLevelDifference = (startDate, endDate) => {
  const endDateInterval = endDate ? new Date(endDate) : new Date()
  const startDateInterval = new Date(startDate)

  const intervalDuration = intervalToDuration({
    start: startDateInterval,
    end: endDateInterval
  })

  const diff = {
    ...intervalDurationMappings,
    ...intervalDuration
  }

  if (diff.years >= 10) return timelineZoomEnums.decade
  if (diff.years >= 1) return timelineZoomEnums.year
  if (diff.months >= 1) return timelineZoomEnums.month
  if (diff.days >= 1) return timelineZoomEnums.day

  return timelineZoomEnums.hour
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
    // If we aren't on the project page, we want to query the focusedCollection
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
      startDates.push(metadata?.timeStart ? new Date(metadata.timeStart).getTime() : currentDate - (24 * 60 * 60 * 1000))
      endDates.push(metadata?.timeEnd ? new Date(metadata.timeEnd).getTime() : currentDate)
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
    zoomLevel: timelineIntervals[calculatedInterval]
      ? parseInt(timelineIntervals[calculatedInterval], 10)
      : 5,
    initialCenter: timeStart && timeEnd
      ? (timeStart + timeEnd) / 2
      : currentDate
  }
}
