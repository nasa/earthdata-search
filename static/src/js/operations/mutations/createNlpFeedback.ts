import { gql } from '@apollo/client'

const CREATE_NLP_FEEDBACK = gql`
  mutation CreateNlpFeedback(
    $nlpRequestId: String!
    $positive: Boolean!
  ) {
    createNlpFeedback(
      nlpRequestId: $nlpRequestId
      positive: $positive
    )
  }
`

export default CREATE_NLP_FEEDBACK
