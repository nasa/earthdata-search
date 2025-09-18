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
      // This wildcard will catch any mutations we do not explicitly allow since we are not
      // using the `fallbackRule`
      '*': deny,
      adminPreferencesMetrics: and(
        isValidUser,
        isAdminUser
      ),
      adminProject: and(
        isValidUser,
        isAdminUser
      ),
      adminProjects: and(
        isValidUser,
        isAdminUser
      ),
      adminRetrieval: and(
        isValidUser,
        isAdminUser
      ),
      adminRetrievals: and(
        isValidUser,
        isAdminUser
      )
    }
    // TODO When we add mutations here, we need to ensure we add a wildcard deny rule like we have for the Query
    // Mutation: {
    //   '*': deny
    // }
  }
)

export default buildPermissions
