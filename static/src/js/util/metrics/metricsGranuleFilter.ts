const { dataLayer = [] } = window

type MetricsGranuleFilterParams = {
  /** The type of granule filter */
  type: string
  /** The value associated with the filter */
  value: string | number
}

/**
* Pushes a granuleFilter event on the dataLayer.
*/
export const metricsGranuleFilter = ({
  type,
  value
}: MetricsGranuleFilterParams) => {
  dataLayer.push({
    event: 'granuleFilter',
    granuleFilterCategory: 'Granule Filter',
    granuleFilterEventAction: type,
    granuleFilterEventValue: value
  })
}
