/**
 * Converts NLP temporal data to the application's temporal format
 * @param {Object} nlpTemporal - The temporal object from NLP response
 * @param {string} nlpTemporal.startDate - The start date in ISO format (e.g., "2020-01-01T00:00:00+00:00")
 * @param {string} nlpTemporal.endDate - The end date in ISO format (e.g., "2020-12-31T00:00:00+00:00")
 * @returns {Object|null} - Temporal object in application format, or null if invalid
 * @returns {string} returns.startDate - Start date string in ISO format
 * @returns {string} returns.endDate - End date string in ISO format
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

    // Convert start date from ISO format to application format
    if (startDate) {
      const startDateObj = new Date(startDate)
      if (!Number.isNaN(startDateObj.getTime())) {
        convertedStartDate = startDateObj.toISOString()
      } else {
        console.warn('Invalid start date format:', startDate)
      }
    }

    // Convert end date from ISO format to application format
    if (endDate) {
      const endDateObj = new Date(endDate)
      if (!Number.isNaN(endDateObj.getTime())) {
        // If the time is 00:00:00, change it to end of day
        const isStartOfDay = endDateObj.getUTCHours() === 0
          && endDateObj.getUTCMinutes() === 0
          && endDateObj.getUTCSeconds() === 0
        if (isStartOfDay) {
          endDateObj.setUTCHours(23, 59, 59, 999)
        }

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
