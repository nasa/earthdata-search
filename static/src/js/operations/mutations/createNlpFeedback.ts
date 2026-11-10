import { gql } from '@apollo/client'

const CREATE_NLP_FEEDBACK = gql`
  mutation CreateNlpFeedback(
    $nlpRequestId: String!
    $positive: Boolean!
    $nlpQuery: String!
  ) {
    createNlpFeedback(
      nlpRequestId: $nlpRequestId
      positive: $positive
      nlpQuery: $nlpQuery
    )
  }
`

export default CREATE_NLP_FEEDBACK
