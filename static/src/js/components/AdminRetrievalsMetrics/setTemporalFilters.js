const setTemporalFilters = (
  event,
  {
    onUpdateAdminMetricsRetrievalsStartDate,
    onUpdateAdminMetricsRetrievalsEndDate,
    setTemporalFilterStartDate,
    setTemporalFilterEndDate,
    onFetchAdminMetricsRetrievals
  }
) => {
  const { collection } = event

  const { temporal } = collection

  const { startDate, endDate } = temporal

  // Update `redux` stores
  onUpdateAdminMetricsRetrievalsStartDate(startDate)
  onUpdateAdminMetricsRetrievalsEndDate(endDate)

  // Only query database if a temporal filter is selected
  if (startDate || endDate) {
    setTemporalFilterStartDate(startDate)
    setTemporalFilterEndDate(endDate)
    onFetchAdminMetricsRetrievals()
  }
}

export default setTemporalFilters
