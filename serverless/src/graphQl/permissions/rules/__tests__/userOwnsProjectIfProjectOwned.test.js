import userOwnsProjectIfProjectOwned from '../userOwnsProjectIfProjectOwned'

describe('userOwnsProjectIfProjectOwned', () => {
  test('returns false if the project does not exist', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue(null)
    }

    const result = await userOwnsProjectIfProjectOwned.resolve(
      null,
      {
        obfuscatedId: 'test-obfuscated-id'
      },
      {
        databaseClient,
        user: undefined
      }
    )

    expect(result).toEqual(false)

    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })

  test('returns false if the user does not own the project', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 2
      })
    }

    const result = await userOwnsProjectIfProjectOwned.resolve(
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

  test('returns false if the user is anonymous and the project has a user_id', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 1
      })
    }

    const result = await userOwnsProjectIfProjectOwned.resolve(
      null,
      {
        obfuscatedId: 'test-obfuscated-id'
      },
      {
        databaseClient,
        user: undefined
      }
    )

    expect(result).toEqual(false)

    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })

  test('returns true if the project has no user_id and the user is anonymous', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: null
      })
    }

    const result = await userOwnsProjectIfProjectOwned.resolve(
      null,
      {
        obfuscatedId: 'test-obfuscated-id'
      },
      {
        databaseClient,
        user: {}
      }
    )

    expect(result).toEqual(true)

    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getProjectByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })

  test('returns true if the user owns the project', async () => {
    const databaseClient = {
      getProjectByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 1
      })
    }

    const result = await userOwnsProjectIfProjectOwned.resolve(
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
