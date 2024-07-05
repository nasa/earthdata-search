import moment from 'moment'
import { getTemporalDateFormat } from '../../../../sharedUtils/edscDate'

/**
 * Returns a string displaying the temporal information.
 * @param {Object} temporal Object that holds the different temporal properties.
 * @returns {String} Returns a string formatting the temporal properties areas into human readable values.
 */
export const createTemporalDisplay = (temporal) => {
  const {
    endDate,
    isRecurring,
    startDate
  } = temporal

  const temporalDateFormat = getTemporalDateFormat(isRecurring)
  const format = 'YYYY-MM-DDTHH:m:s.SSSZ'

  let startDateObject
  let endDateObject = moment.utc(endDate, format, true)
  let startDateDisplay
  let endDateDisplay
  if (startDate) {
    startDateObject = moment.utc(startDate, format, true)
  }

  if (endDate) {
    endDateObject = moment.utc(endDate, format, true)
  }

  if (startDateObject) {
    startDateDisplay = startDateObject.format(temporalDateFormat)
  }

  if (endDateObject) {
    endDateDisplay = endDateObject.format(temporalDateFormat)
  }

  let selectedTemporalDisplay

  if (startDate && endDate) {
    selectedTemporalDisplay = `${startDateDisplay} to ${endDateDisplay}`
  }

  if (startDate && !endDate) {
    selectedTemporalDisplay = `${startDateDisplay} ongoing`
  }

  if (endDate && !startDate) {
    selectedTemporalDisplay = `Up to ${endDateDisplay}`
  }

  return selectedTemporalDisplay
}

export default createTemporalDisplay
