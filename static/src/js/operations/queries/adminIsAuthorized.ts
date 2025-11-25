import { gql } from '@apollo/client'

const ADMIN_IS_AUTHORIZED = gql`
  query AdminIsAuthorized {
    adminIsAuthorized
  }
`

export default ADMIN_IS_AUTHORIZED
