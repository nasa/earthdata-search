import moment from 'moment'

import isCustomTime from './datepicker'

/**
 * Formats the datetime value (moment or string)
 * @param {Object} value datetime or datetime string
 * @param {Array} timeOfDay string that is either start or end though we only check for end date
 * @returns {moment} returns formatted moment that is either the date passed in or makes it the end of the day/month/year
 */
export const formatDate = (value, timeOfDay) => {
  let dateMoment = null

  // Convert the string to be a moment if is not one yet
  if (!moment.isMoment(value)) {
    dateMoment = moment.utc(value, [moment.ISO_8601, 'YYYY-MM-DDTHH:mm:ss.SSSZ'], true)
  } else {
    dateMoment = value
  }

  // Check if the time is a custom time (not a 00:00:00 time) or if it's invalid
  if (!dateMoment || isCustomTime(dateMoment) || !dateMoment.isValid()) {
    return dateMoment
  }

  // eslint-disable-next-line no-underscore-dangle
  const format = dateMoment._f

  if (timeOfDay === 'end') {
    switch (format) {
      case 'YYYY':
        return dateMoment.endOf('year')
      case 'YYYY-MM':
        return dateMoment.endOf('month')
      default:
        return dateMoment.endOf('day')
    }
  }

  return dateMoment
}
