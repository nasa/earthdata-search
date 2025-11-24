import { gql } from '@apollo/client'

const ADMIN_RETRIEVALS_METRICS = gql`
  query AdminRetrievalsMetrics(
    $startDate: DateTime
    $endDate: DateTime!
  ) {
    adminRetrievalsMetrics(
      startDate: $startDate,
      endDate: $endDate
    ) {
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
