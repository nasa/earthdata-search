import { gql } from '@apollo/client'

const UPDATE_NLP_FEEDBACK = gql`
  mutation UpdateNlpFeedback(
    $feedback: String
    $incomplete: Boolean
    $keyword: Boolean
    $nlpRequestId: String!
    $other: Boolean
    $relevancy: Boolean
    $spatial: Boolean
    $temporal: Boolean
  ) {
    updateNlpFeedback(
      feedback: $feedback
      incomplete: $incomplete
      keyword: $keyword
      nlpRequestId: $nlpRequestId
      other: $other
      relevancy: $relevancy
      spatial: $spatial
      temporal: $temporal
    )
  }
`

export default UPDATE_NLP_FEEDBACK
