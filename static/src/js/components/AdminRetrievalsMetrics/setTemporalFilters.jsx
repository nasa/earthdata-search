/**
 * Runs state change and redux update methods for `AdminRetrievalsMetrics`
 * @param {Object} event - Object containing temporal filter parameters
 * @param {String} props.onUpdateAdminRetrievalsMetricsStartDate - Function to set redux store
 * @param {String} props.onUpdateAdminRetrievalsMetricsStartDate - Function to set redux store
 * @param {Function} props.setTemporalFilterStartDate - Function to set `temporalFilterStartDate` state
 * @param {Function} props.setTemporalFilterEndDate - Function to set `temporalFilterEndDate` state
 * @param {Function} props.onFetchAdminRetrievalsMetrics - Function to request data from handler
* */
const setTemporalFilters = (
  event,
  {
    onUpdateAdminRetrievalsMetricsStartDate,
    onUpdateAdminRetrievalsMetricsEndDate,
    setTemporalFilterStartDate,
    setTemporalFilterEndDate,
    onFetchAdminRetrievalsMetrics
  }
) => {
  const { collection } = event

  const { temporal } = collection

  const { startDate, endDate } = temporal

  // Update `redux` stores
  onUpdateAdminRetrievalsMetricsStartDate(startDate)
  onUpdateAdminRetrievalsMetricsEndDate(endDate)

  // Only query database if a temporal filter is selected
  if (startDate || endDate) {
    setTemporalFilterStartDate(startDate)
    setTemporalFilterEndDate(endDate)
    onFetchAdminRetrievalsMetrics()
  }
}

export default setTemporalFilters
