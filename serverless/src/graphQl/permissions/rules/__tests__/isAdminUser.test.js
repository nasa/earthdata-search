import isAdminUser from '../isAdminUser'
import { getAdminUsers } from '../../../../util/getAdminUsers'

vi.mock('../../../../util/getAdminUsers', () => ({
  getAdminUsers: vi.fn().mockResolvedValue([])
}))

describe('isAdminUser', () => {
  test('returns false if the user is empty', async () => {
    const result = await isAdminUser.resolve(
      null,
      {},
      {
        user: {}
      }
    )

    expect(result).toEqual(false)
  })

  test('returns false if an error is received while getting admin users', async () => {
    getAdminUsers.mockRejectedValue(new Error('Test error'))

    const result = await isAdminUser.resolve(
      null,
      {},
      {
        user: {
          id: 1,
          urs_id: 'testuser'
        }
      }
    )

    expect(result).toEqual(false)
  })

  test('returns false if the user does not exist in the admin users', async () => {
    getAdminUsers.mockResolvedValue([])

    const result = await isAdminUser.resolve(
      null,
      {},
      {
        user: {
          id: 1,
          urs_id: 'testuser'
        }
      }
    )

    expect(result).toEqual(false)
  })

  test('returns true if the user is an admin', async () => {
    getAdminUsers.mockResolvedValue(['adminuser'])

    const result = await isAdminUser.resolve(
      null,
      {},
      {
        user: {
          id: 1,
          urs_id: 'adminuser'
        }
      }
    )

    expect(result).toEqual(true)
  })
})
