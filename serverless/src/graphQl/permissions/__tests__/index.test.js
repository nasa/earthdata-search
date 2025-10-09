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
        allowExternalErrors: false
      }
    )
  })
})
