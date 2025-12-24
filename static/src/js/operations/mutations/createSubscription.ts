import { gql } from '@apollo/client'

const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription ($params: CreateSubscriptionInput) {
    createSubscription (params: $params) {
      conceptId
    }
  }
`

export default CREATE_SUBSCRIPTION
