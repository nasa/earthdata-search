import { and, shield } from 'graphql-shield'

import isValidUser from '../rules/isValidUser'
import isAdminUser from '../rules/isAdminUser'

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
          adminPreferencesMetrics: and(
            isValidUser,
            isAdminUser
          )
        }
      },
      expect.anything()
    )
  })
})
