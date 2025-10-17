import userOwnsProject from '../userOwnsProject'

describe('userOwnsProject', () => {
  test('returns false if the user is empty', async () => {
    const result = await userOwnsProject.resolve(
      null,
      {},
      {
        user: {}
      }
    )

    expect(result).toEqual(false)
  })

  test('returns false if the user does not own the project', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 2
      })
    }

    const result = await userOwnsProject.resolve(
      null,
      {
        obfuscatedId: 'test-obfuscated-id'
      },
      {
        databaseClient,
        user: {
          id: 1
        }
      }
    )

    expect(result).toEqual(false)

    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })

  test('returns true if the user is an admin', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 1
      })
    }

    const result = await userOwnsProject.resolve(
      null,
      {
        obfuscatedId: 'test-obfuscated-id'
      },
      {
        databaseClient,
        user: {
          id: 1
        }
      }
    )

    expect(result).toEqual(true)

    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })
})
