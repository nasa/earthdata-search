import {
  intervalToDuration,
  differenceInYears,
  differenceInMonths,
  differenceInDays
} from 'date-fns'
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
 * Return the minimum timeline interval that can encompass the collection data
 */
export const timelineMidpoint = (startDate, endDate) => {
  const date1 = new Date(startDate)
  console.log('🚀 ~ file: timeline.js:22 ~ date1:', date1)
  const date2 = new Date(endDate)
  console.log('🚀 ~ file: timeline.js:24 ~ date2:', date2)

  const milliseconds1 = date1.getTime()
  console.log('🚀 ~ file: timeline.js:27 ~ milliseconds1:', milliseconds1)
  const milliseconds2 = date2.getTime()
  // Calculate the midpoint in milliseconds
  const midpointMilliseconds = (milliseconds1 + milliseconds2) / 2
  console.log('🚀 ~ file: timeline.js:31 ~ midpointMilliseconds:', midpointMilliseconds)

  // Create a new date object from the midpoint milliseconds
  const midpointDate = new Date(midpointMilliseconds)
  const midpointDatereturn = midpointDate.getTime()

  return midpointDatereturn
}

// TODO find the earliest and latest time in a project take their average for the center

export const getTimelineProjectCenter = (temporalStart, temporalEnd) => {
  console.log('🚀 ~ file: timeline.js:47 ~ temporalEnd:', temporalEnd)
  console.log('🚀 ~ file: timeline.js:47 ~ temporalStart:', temporalStart)
  const startDate = new Date(temporalStart)
  const endDate = new Date(temporalEnd)

  const timeStart = startDate.getTime()
  const timeEnd = endDate.getTime()

  const midpointMilliseconds = (timeStart + timeEnd) / 2
  const midpointDate = new Date(midpointMilliseconds)

  return midpointDate
}

export const isOngoingCollection = (temporal) => {
  if (temporal.includes('ongoing')) {
    return true
  }

  return false
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
  hours: 0,
  minutes: 0,
  seconds: 0
}

export const zoomLevelDifference = (startDate, endDate) => {
  console.log('🚀 ~ file: timeline.js:85 ~ endDate:', endDate)
  console.log('🚀 ~ file: timeline.js:85 ~ startDate:', startDate)
  let date2
  if (!endDate) {
    date2 = new Date().getTime()
  } else {
    date2 = new Date(endDate)
  }

  const date1 = new Date(startDate)
  console.log('🚀 ~ file: timeline.js:22 ~ date1:', date1)
  console.log('🚀 ~ file: timeline.js:24 ~ date2:', date2)

  const intervalDuration = intervalToDuration({
    start: date1,
    end: date2
  })

  // TODO date-fns claims it is using Date time objs but, for some reason these
  // first have to be converted to milliseconds
  // Merge the template to maintain 0 time differences
  const diff = {
    ...intervalDurationMappings,
    ...intervalDuration
  }
  console.log('🚀 ~ file: timeline.js:108 ~ diff:', diff)

  // Determine the minimal time range to hold the data collection extent
  if (diff.years < 1) {
    if (diff.months < 1) {
      if (diff.days < 1) {
        return timelineZoomEnums.hour
      }

      return timelineZoomEnums.day
    }

    return timelineZoomEnums.month
  }

  if (diff.years < 10) {
    return timelineZoomEnums.year
  }

  return timelineZoomEnums.decade
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
