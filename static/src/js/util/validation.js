import * as Yup from 'yup'
import moment from 'moment'

const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ'

/**
 * Returns null if the original value passed is an empty string
 * @param {String} value - The validated field value
 * @param {String} originalValue - The original field value
 * @returns {Null|String} null or the valid field value
 */
export const nullableValue = (value, originalValue) => (originalValue.trim() === '' ? null : value)

/**
 * Returns null if the original date passed is an invalid moment object
 * @param {String} value - The validated field value
 * @param {String} originalValue - The original field value
 * @returns {Null|String} null or the valid field value
 */
export const nullableTemporal = (value, originalValue) => {
  const isDate = value instanceof Date
  if ((isDate && !Number.isNaN(value)) && originalValue === '') {
    return null
  }
  return value
}

/**
 * Checks to see if the value the cloudCover.min is less than cloudCover.max
 * @param {String} value - The field value to be validatated
 * @returns {Boolean} The result
 */
export function minLessThanMax(value) {
  // If the value is not set, dont check
  if (!value) return true

  const min = value
  const max = this.resolve(Yup.ref('max'))

  // If there is no max
  if (!max) return true

  return min <= max
}

/**
 * Checks to see if the value the cloudCover.max is less than cloudCover.min
 * @param {String} value - The field value to be validatated
 * @returns {Boolean} The result
 */
export function maxLessThanMin(value) {
  // If the value is not set, dont check
  if (!value) return true

  const max = value
  const min = this.resolve(Yup.ref('min'))

  // If there is no min
  if (!min) return true

  return max >= min
}

/**
 * Checks to see if the value the temporal.startDate is before than temporal.endDate
 * @param {String} value - The field value to be validatated
 * @returns {Boolean} The result
 */
export function startBeforeEnd(value) {
  if (!value) return true
  const endDate = this.resolve(Yup.ref('endDate'))
  const momentEndVal = moment(endDate, dateFormat, true)
  const momentStartVal = moment(value, dateFormat, true)
  if (momentStartVal && !endDate) return true
  return momentStartVal.isBefore(momentEndVal)
}

/**
 * Checks to see if the value sits within two values
 * @param {String} value - The field value to be validatated
 * @param {String} startDate - The starting value to compare with
 * @param {String} endDate - The ending value to compare with
 * @returns {Boolean} The result
 */
export function dateOutsideRange(value, startDate, endDate) {
  if (!value || (!startDate && !endDate)) return true

  const momentVal = moment(value, dateFormat, true)
  const momentStartVal = moment(startDate, dateFormat, true)
  const momentEndVal = moment(endDate, dateFormat, true)

  if (!endDate) {
    return momentVal.isSameOrAfter(momentStartVal)
  }

  if (!startDate) {
    return momentVal.isSameOrBefore(momentEndVal)
  }

  return momentVal.isBetween(momentStartVal, momentEndVal, undefined, '[]')
}
