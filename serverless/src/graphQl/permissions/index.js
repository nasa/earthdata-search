import {
  allow,
  and,
  deny,
  shield
} from 'graphql-shield'

import isValidUser from './rules/isValidUser'
import isAdminUser from './rules/isAdminUser'
import userOwnsProject from './rules/userOwnsProject'

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
      ),
      project: allow,
      projects: isValidUser
    },
    Mutation: {
      '*': deny,
      createProject: isValidUser,
      deleteProject: and(
        isValidUser,
        userOwnsProject
      ),
      updateProject: and(
        isValidUser,
        userOwnsProject
      )
    }
  },
  {
    // Only allow the external errors when running in the local DEV environment
    allowExternalErrors: process.env.NODE_ENV === 'development'
  }
)

export default buildPermissions
