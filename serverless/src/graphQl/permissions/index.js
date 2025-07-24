import {
  and,
  deny,
  shield
} from 'graphql-shield'

import isValidUser from './rules/isValidUser'
import isAdminUser from './rules/isAdminUser'

const buildPermissions = () => shield(
  {
    Query: {
      adminPreferencesMetrics: and(
        isValidUser,
        isAdminUser
      )
    }
  },
  {
    fallbackRule: deny
  }
)

export default buildPermissions
