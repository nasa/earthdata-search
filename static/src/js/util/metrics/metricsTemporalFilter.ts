const { dataLayer = [] } = window

type MetricsTemporalFilterParams = {
  /** The type of temporal filter */
  type: string
  /** The value associated with the filter */
  value: string | number
}

/**
* Pushes a temporalFilter event on the dataLayer.
*/
export const metricsTemporalFilter = ({
  type,
  value
}: MetricsTemporalFilterParams) => {
  dataLayer.push({
    event: 'temporalFilter',
    temporalFilterCategory: 'Temporal Filter',
    temporalFilterEventAction: type,
    temporalFilterEventValue: value
  })
}
