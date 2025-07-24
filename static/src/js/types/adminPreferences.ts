export type MetricType = {
  count: number
  lastUpdated: string
  // ...other fields...
}

export type AdminPreferencesMetrics = Record<string, MetricType>
  metricA: MetricType
  metricB: MetricType
  // ...other known metrics...
}
