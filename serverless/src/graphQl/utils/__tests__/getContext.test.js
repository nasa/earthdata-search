import getContext from '../getContext'
import DatabaseClient from '../databaseClient'
import { validateToken } from '../../../util/authorizer/validateToken'

jest.mock('../../../util/authorizer/validateToken', () => ({
  validateToken: jest.fn().mockResolvedValue({ userId: 1 })
}))

describe('getContext', () => {
  it('should return the correct context', async () => {
    const getUserByIdSpy = jest.spyOn(DatabaseClient.prototype, 'getUserById')
    getUserByIdSpy.mockResolvedValue({
      id: 1,
      name: 'John Doe'
    })

    const event = {
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

    expect(validateToken).toHaveBeenCalledWith('token', 'prod')
    expect(getUserByIdSpy).toHaveBeenCalledWith(1)
  })

  describe('when the user does not exist in the database', () => {
    it('should return the correct context with null user', async () => {
      const getUserByIdSpy = jest.spyOn(DatabaseClient.prototype, 'getUserById')
      getUserByIdSpy.mockResolvedValue(null)

      const event = {
        headers: {
          authorization: 'Bearer token'
        }
      }

      const { user } = await getContext({ event })

      expect(user).toEqual({})
    })
  })
})
