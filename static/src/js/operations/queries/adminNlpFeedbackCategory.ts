import { gql } from '@apollo/client'

const ADMIN_NLP_FEEDBACK_CATEGORY = gql`
  query AdminNlpFeedbackCategory(
    $startDate: DateTime!
    $endDate: DateTime!
    $category: NlpFeedbackCategory!
    $limit: Int
    $offset: Int
  ) {
    adminNlpFeedbackCategory(
      startDate: $startDate
      endDate: $endDate
      category: $category
      limit: $limit
      offset: $offset
    ) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        pageCount
      }
      count
      adminNlpFeedback {
        nlpRequestId
        nlpQuery
        keyword
        spatial
        temporal
        incomplete
        relevancy
        other
        feedback
      }
    }
  }
`

export default ADMIN_NLP_FEEDBACK_CATEGORY
