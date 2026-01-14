import userOwnsRetrieval from '../userOwnsRetrieval'

describe('userOwnsRetrieval', () => {
  test('returns false if the user is empty', async () => {
    const result = await userOwnsRetrieval.resolve(
      null,
      {},
      {
        user: {}
      }
    )

    expect(result).toEqual(false)
  })

  test('returns false if the user does not own the Retrieval', async () => {
    const databaseClient = {
      getRetrievalByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 2
      })
    }

    const result = await userOwnsRetrieval.resolve(
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

    expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })

  test('returns true if the user owns the retrieval', async () => {
    const databaseClient = {
      getRetrievalByObfuscatedId: jest.fn().mockResolvedValue({
        user_id: 1
      })
    }

    const result = await userOwnsRetrieval.resolve(
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

    expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledTimes(1)
    expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id')
  })
})
