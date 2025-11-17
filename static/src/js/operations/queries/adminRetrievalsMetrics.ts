import { gql } from '@apollo/client'

const ADMIN_RETRIEVALS_METRICS = gql`
  query AdminRetrievalsMetrics($params: AdminRetrievalsMetricsInput) {
    adminRetrievalsMetrics(params: $params) {
      retrievalResponse {
        accessMethodType
        totalTimesAccessMethodUsed
        averageGranuleCount
        averageGranuleLinkCount
        totalGranulesRetrieved
        maxGranuleLinkCount
        minGranuleLinkCount
      }
      multCollectionResponse {
        collectionCount
        retrievalId
      }
    }
  }
`
export default ADMIN_RETRIEVALS_METRICS
