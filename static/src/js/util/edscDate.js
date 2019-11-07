import moment from 'moment'
import { getApplicationConfig } from '../../../../sharedUtils/config'

export const normalizeTime = (time) => {
  if (!time) return null

  const { temporalDateFormatFull } = getApplicationConfig()

  return moment(time).utc().format(temporalDateFormatFull)
}

export const getTemporal = (start, end) => {
  const normStart = normalizeTime(start)
  const normEnd = normalizeTime(end)

  if (normStart === normEnd) return [normStart, null]
  if (!normEnd) return [normStart, null]
  if (!normStart) return [null, normEnd]
  return [normStart, normEnd]
}

export const getTemporalDateFormat = (isRecurring) => {
  const {
    temporalDateFormatFull,
    temporalDateFormatRange
  } = getApplicationConfig()

  return isRecurring ? temporalDateFormatRange : temporalDateFormatFull
}

/**
 * Uses the Year component of each date as the bounds to create a range using day and month of each date provided
 * @param {String} startDate Date to start the range on
 * @param {String} endDate Date to end the range on
 */
export const getTemporalRange = (startDate, endDate) => {
  const rangeArray = []

  const normalizedStartDate = moment(startDate).utc()
  const normalizedEndDate = moment(endDate).utc()

  const startDateParts = {
    days: normalizedStartDate.date(),
    months: normalizedStartDate.month()
  }

  const endDateParts = {
    days: normalizedEndDate.date(),
    months: normalizedEndDate.month()
  }

  const yearSpan = normalizedEndDate.year() - normalizedStartDate.year() + 1

  Array.from(Array(yearSpan)).forEach((_, index) => {
    const loopYear = index + normalizedStartDate.year()

    rangeArray.push([
      moment({
        ...startDateParts,
        year: loopYear
      }).utc().startOf('day').toDate(),
      moment({
        ...endDateParts,
        year: loopYear
      }).utc().endOf('day').toDate()
    ])
  })

  return rangeArray
}
