import {
  allow,
  and,
  deny,
  guard
} from 'graphql-guard'

import isValidUser from '../rules/isValidUser'
import isAdminUser from '../rules/isAdminUser'
import userOwnsProject from '../rules/userOwnsProject'

import buildPermissions from '../index'
import userOwnsProjectIfProjectOwned from '../rules/userOwnsProjectIfProjectOwned'
import userOwnsRetrieval from '../rules/userOwnsRetrieval'

vi.mock('graphql-guard', async () => ({
  ...(await vi.importActual('graphql-guard')),
  guard: vi.fn()
}))

describe('permissions', () => {
  test('permissions are correct', () => {
    const schema = {}

    buildPermissions(schema)

    expect(guard).toHaveBeenCalledTimes(1)
    expect(guard).toHaveBeenCalledWith(
      schema,
      {
        Query: {
          '*': deny,
          adminIsAuthorized: and(
            isValidUser,
            isAdminUser
          ),
          adminNlpFeedbackReport: and(
            isValidUser,
            isAdminUser
          ),
          adminNlpFeedbackCategory: and(
            isValidUser,
            isAdminUser
          ),
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
          colormaps: allow,
          project: allow,
          projects: isValidUser,
          regions: allow,
          retrieval: isValidUser,
          historyRetrievals: isValidUser,
          retrievalCollection: isValidUser,
          retrieveGranuleLinks: isValidUser,
          user: isValidUser
        },
        Mutation: {
          '*': deny,
          adminRequeueOrder: and(
            isValidUser,
            isAdminUser
          ),
          createNlpFeedback: allow,
          createProject: allow,
          createRetrieval: isValidUser,
          deleteProject: and(
            isValidUser,
            userOwnsProject
          ),
          deleteRetrieval: and(
            isValidUser,
            userOwnsRetrieval
          ),
          updateNlpFeedback: allow,
          updatePreferences: isValidUser,
          updateProject: userOwnsProjectIfProjectOwned
        }
      },
      {
        suppressResolverError: true
      }
    )
  })
})
