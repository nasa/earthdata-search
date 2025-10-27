import { gql } from '@apollo/client'

const UPDATE_CMR_ORDERING_USER = gql`
  mutation UpdateUser (
    $ursId: String!,
    $notificationLevel: NotificationLevel!
  ) {
    updateUser (
      ursId: $ursId,
      notificationLevel: $notificationLevel
    ) {
      ursId
      notificationLevel
    }
  }
`

export default UPDATE_CMR_ORDERING_USER
