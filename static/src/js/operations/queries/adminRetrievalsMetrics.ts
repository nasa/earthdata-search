import { gql } from '@apollo/client'

const ADMIN_RETRIEVALS_METRICS = gql`
  query AdminRetrievalsMetrics($params: AdminRetrievalsMetricsInput) {
    adminRetrievalsMetrics(params: $params) {
      retrievalMetricsByAccessType {
        accessMethodType
        totalTimesAccessMethodUsed
        averageGranuleCount
        averageGranuleLinkCount
        totalGranulesRetrieved
        maxGranuleLinkCount
        minGranuleLinkCount
      }
      multiCollectionResponse {
        collectionCount
        obfuscatedId
        retrievalId
      }
    }
  }
`
export default ADMIN_RETRIEVALS_METRICS
