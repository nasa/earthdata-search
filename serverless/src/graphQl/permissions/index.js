import {
  allow,
  and,
  deny,
  shield
} from 'graphql-shield'

import isValidUser from './rules/isValidUser'
import isAdminUser from './rules/isAdminUser'
import userOwnsProject from './rules/userOwnsProject'
import userOwnsProjectIfProjectOwned from './rules/userOwnsProjectIfProjectOwned'

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
      adminRetrievalsMetrics: and(
        isValidUser,
        isAdminUser
      ),
      project: allow,
      projects: isValidUser,
      retrieval: isValidUser,
      retrievalCollection: isValidUser,
      retrieveGranuleLinks: isValidUser,
      user: isValidUser
    },
    Mutation: {
      '*': deny,
      createProject: allow,
      createRetrieval: isValidUser,
      deleteProject: and(
        isValidUser,
        userOwnsProject
      ),
      updatePreferences: isValidUser,
      updateProject: userOwnsProjectIfProjectOwned
    }
  },
  {
    // Only allow the external errors when running in the local DEV environment
    allowExternalErrors: process.env.NODE_ENV === 'development'
  }
)

export default buildPermissions
