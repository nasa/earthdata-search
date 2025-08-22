/**
 * Converts NLP temporal data to the application's temporal format
 * @param {Object} nlpTemporal - The temporal object from NLP response
 * @param {string} nlpTemporal.startDate - The start date in YYYY-MM-DD format
 * @param {string} nlpTemporal.endDate - The end date in YYYY-MM-DD format
 * @returns {Object|null} - Temporal object in application format, or null if invalid
 * @returns {string} returns.startDate - Start date string
 * @returns {string} returns.endDate - End date string
 * @returns {string} returns.recurringDayStart - Recurring day start (empty for NLP data)
 * @returns {string} returns.recurringDayEnd - Recurring day end (empty for NLP data)
 * @returns {boolean} returns.isRecurring - Whether this is recurring temporal data (always false for NLP)
 */
export const convertNlpTemporalData = (nlpTemporal) => {
  if (!nlpTemporal || typeof nlpTemporal !== 'object') {
    return null
  }

  const { startDate, endDate } = nlpTemporal

  if (!startDate && !endDate) {
    return null
  }

  try {
    let convertedStartDate = ''
    let convertedEndDate = ''

    // Convert start date from "YYYY-MM-DD" to "YYYY-MM-DDTHH:mm:ss.sssZ"
    if (startDate) {
      const startDateObj = new Date(`${startDate}T00:00:00.000Z`)
      if (!Number.isNaN(startDateObj.getTime())) {
        convertedStartDate = startDateObj.toISOString()
      } else {
        console.warn('Invalid start date format:', startDate)
      }
    }

    // Convert end date from "YYYY-MM-DD" to "YYYY-MM-DDTHH:mm:ss.sssZ"
    if (endDate) {
      const endDateObj = new Date(`${endDate}T23:59:59.999Z`)
      if (!Number.isNaN(endDateObj.getTime())) {
        convertedEndDate = endDateObj.toISOString()
      } else {
        console.warn('Invalid end date format:', endDate)
      }
    }

    const applicationTemporal = {
      startDate: convertedStartDate,
      endDate: convertedEndDate,
      recurringDayStart: '',
      recurringDayEnd: '',
      isRecurring: false
    }

    return applicationTemporal
  } catch (error) {
    console.error('Error converting NLP temporal data:', error)

    return null
  }
}

export default convertNlpTemporalData
