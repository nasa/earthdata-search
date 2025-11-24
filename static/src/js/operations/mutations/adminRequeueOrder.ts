import { gql } from '@apollo/client'

const ADMIN_REQUEUE_ORDER = gql`
  mutation AdminRequeueOrder($retrievalOrderId: Int!) {
    adminRequeueOrder(retrievalOrderId: $retrievalOrderId)
  }
`

export default ADMIN_REQUEUE_ORDER
