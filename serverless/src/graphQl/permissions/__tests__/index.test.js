import {
  allow,
  and,
  deny,
  shield
} from 'graphql-shield'

import isValidUser from '../rules/isValidUser'
import isAdminUser from '../rules/isAdminUser'
import userOwnsProject from '../rules/userOwnsProject'

import buildPermissions from '../index'
import userOwnsProjectIfProjectOwned from '../rules/userOwnsProjectIfProjectOwned'
import userOwnsRetrieval from '../rules/userOwnsRetrieval'

jest.mock('graphql-shield', () => ({
  ...jest.requireActual('graphql-shield'),
  shield: jest.fn()
}))

describe('permissions', () => {
  test('permissions are correct', () => {
    buildPermissions()

    expect(shield).toHaveBeenCalledTimes(1)
    expect(shield).toHaveBeenCalledWith(
      {
        Query: {
          '*': deny,
          adminIsAuthorized: and(
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
          updatePreferences: isValidUser,
          updateProject: userOwnsProjectIfProjectOwned
        }
      },
      {
        allowExternalErrors: false
      }
    )
  })
})
