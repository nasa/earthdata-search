import { gql } from '@apollo/client'

const DELETE_SUBSCRIPTION = gql`
  mutation DeleteSubscription ($params: DeleteSubscriptionInput) {
    deleteSubscription (params: $params) {
      conceptId
    }
  }
`

export default DELETE_SUBSCRIPTION
