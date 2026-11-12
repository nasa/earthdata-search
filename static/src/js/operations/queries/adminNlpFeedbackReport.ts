import { gql } from '@apollo/client'

const ADMIN_NLP_FEEDBACK_REPORT = gql`
  query AdminNlpFeedbackReport(
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    adminNlpFeedbackReport(
      startDate: $startDate
      endDate: $endDate
    ) {
      totalCount
      positiveCount
      negativeCount
      keywordCount
      spatialCount
      temporalCount
      incompleteCount
      relevancyCount
      otherCount
      freeTextCount
    }
  }
`

export default ADMIN_NLP_FEEDBACK_REPORT
