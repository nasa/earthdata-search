import getContext from '../getContext'
import DatabaseClient from '../databaseClient'
import { validateToken } from '../../../util/authorizer/validateToken'

jest.mock('../../../util/authorizer/validateToken', () => ({
  validateToken: jest.fn().mockResolvedValue({ username: 'testuser' })
}))

jest.mock('../../../../../sharedUtils/config', () => ({
  getApplicationConfig: jest.fn().mockImplementation(() => ({
    env: 'testenv'
  }))
}))

describe('getContext', () => {
  test('should return the correct context', async () => {
    const getUserWhereMock = jest.spyOn(DatabaseClient.prototype, 'getUserWhere')
    getUserWhereMock.mockResolvedValue({
      id: 1,
      name: 'John Doe'
    })

    const event = {
      body: JSON.stringify({
        operationName: 'GetUser'
      }),
      headers: {
        authorization: 'Bearer token'
      }
    }

    const { databaseClient, bearerToken, user } = await getContext({ event })

    expect(databaseClient).toBeInstanceOf(DatabaseClient)
    expect(bearerToken).toEqual('Bearer token')
    expect(user).toEqual({
      id: 1,
      name: 'John Doe'
    })

    expect(validateToken).toHaveBeenCalledTimes(1)
    expect(validateToken).toHaveBeenCalledWith('token', 'testenv')

    expect(getUserWhereMock).toHaveBeenCalledTimes(1)
    expect(getUserWhereMock).toHaveBeenCalledWith({
      environment: 'testenv',
      urs_id: 'testuser'
    })
  })

  describe('when the user does not exist in the database', () => {
    test('should return the correct context with an undefined user', async () => {
      const getUserWhereMock = jest.spyOn(DatabaseClient.prototype, 'getUserWhere')
      getUserWhereMock.mockResolvedValue(undefined)

      const event = {
        body: JSON.stringify({
          operationName: 'GetUser'
        }),
        headers: {
          authorization: 'Bearer token'
        }
      }

      const { user } = await getContext({ event })

      expect(user).toEqual(undefined)

      expect(validateToken).toHaveBeenCalledTimes(1)
      expect(validateToken).toHaveBeenCalledWith('token', 'testenv')

      expect(getUserWhereMock).toHaveBeenCalledTimes(1)
      expect(getUserWhereMock).toHaveBeenCalledWith({
        environment: 'testenv',
        urs_id: 'testuser'
      })
    })
  })

  describe('when there is no authorization header', () => {
    test('should return the correct context with an undefined user', async () => {
      const event = {
        body: JSON.stringify({}),
        headers: {}
      }

      const { databaseClient, bearerToken, user } = await getContext({ event })

      expect(databaseClient).toBeInstanceOf(DatabaseClient)
      expect(bearerToken).toEqual('')
      expect(user).toEqual(undefined)

      expect(validateToken).toHaveBeenCalledTimes(1)
      expect(validateToken).toHaveBeenCalledWith(undefined, 'testenv')
    })
  })

  describe('when the operation is IntrospectionQuery', () => {
    test('should return null', async () => {
      const event = {
        body: JSON.stringify({
          operationName: 'IntrospectionQuery'
        }),
        headers: {
          authorization: 'Bearer token'
        }
      }

      const result = await getContext({ event })

      expect(result).toBeNull()
      expect(validateToken).not.toHaveBeenCalled()
    })
  })
})
