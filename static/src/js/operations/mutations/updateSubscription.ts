import { gql } from '@apollo/client'

const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription ($params: UpdateSubscriptionInput) {
    updateSubscription (params: $params) {
      conceptId
    }
  }
`

export default UPDATE_SUBSCRIPTION
