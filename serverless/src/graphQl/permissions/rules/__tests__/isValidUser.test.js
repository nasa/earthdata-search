import isValidUser from '../isValidUser'

describe('isValidUser', () => {
  test('returns false if the user is empty', async () => {
    const result = await isValidUser.resolve(
      null,
      {},
      {
        user: {}
      }
    )

    expect(result).toEqual(false)
  })

  test('returns true if the user is not empty', async () => {
    const result = await isValidUser.resolve(
      null,
      {},
      {
        user: {
          id: 1,
          urs_id: 'testuser'
        }
      }
    )

    expect(result).toEqual(true)
  })
})
