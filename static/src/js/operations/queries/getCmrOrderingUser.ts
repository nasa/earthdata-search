import { gql } from '@apollo/client'

const GET_CMR_ORDERING_USER = gql`
  query User(
    $ursId: String!
  ) {
    user(
      ursId: $ursId
    ) {
      ursId
      notificationLevel
    }
  }
`

export default GET_CMR_ORDERING_USER
