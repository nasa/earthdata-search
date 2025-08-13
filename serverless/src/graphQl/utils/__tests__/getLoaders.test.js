import DataLoader from 'dataloader'
import getLoaders from '../getLoaders'

const mockContext = {
  databaseClient: {
    getRetrievalCollectionsByRetrievalId: jest.fn(),
    getRetrievalOrdersByRetrievalCollectionId: jest.fn(),
    getUsersById: jest.fn()
  }
}

describe('getLoaders', () => {
  test('returns the correct loaders', () => {
    const loaders = getLoaders(mockContext)
    expect(loaders).toEqual({
      retrievalCollections: expect.any(DataLoader),
      retrievalOrders: expect.any(DataLoader),
      users: expect.any(DataLoader)
    })
  })

  describe('retrievalCollections loader', () => {
    test('loads a retrieval collection by ID', async () => {
      mockContext.databaseClient.getRetrievalCollectionsByRetrievalId.mockResolvedValue([
        {
          id: 1,
          retrieval_id: 1,
          name: 'Retrieval Collection 1'
        },
        {
          id: 2,
          retrieval_id: 1,
          name: 'Retrieval Collection 2'
        },
        {
          id: 3,
          retrieval_id: 2,
          name: 'Retrieval Collection 3'
        }
      ])

      const loaders = getLoaders(mockContext)
      const collections = await loaders.retrievalCollections.load(1)

      expect(
        mockContext.databaseClient.getRetrievalCollectionsByRetrievalId
      ).toHaveBeenCalledTimes(1)

      expect(
        mockContext.databaseClient.getRetrievalCollectionsByRetrievalId
      ).toHaveBeenNthCalledWith(1, [1])

      expect(collections).toEqual([
        {
          id: 1,
          retrieval_id: 1,
          name: 'Retrieval Collection 1'
        },
        {
          id: 2,
          retrieval_id: 1,
          name: 'Retrieval Collection 2'
        }
      ])
    })
  })

  describe('retrievalOrders loader', () => {
    test('loads a retrieval orders by ID', async () => {
      mockContext.databaseClient.getRetrievalOrdersByRetrievalCollectionId.mockResolvedValue([
        {
          id: 1,
          retrieval_collection_id: 1,
          name: 'Retrieval Order 1'
        },
        {
          id: 2,
          retrieval_collection_id: 1,
          name: 'Retrieval Order 2'
        },
        {
          id: 3,
          retrieval_collection_id: 2,
          name: 'Retrieval Order 3'
        }
      ])

      const loaders = getLoaders(mockContext)
      const collections = await loaders.retrievalOrders.load(1)

      expect(
        mockContext.databaseClient.getRetrievalOrdersByRetrievalCollectionId
      ).toHaveBeenCalledTimes(1)

      expect(
        mockContext.databaseClient.getRetrievalOrdersByRetrievalCollectionId
      ).toHaveBeenCalledWith([1])

      expect(collections).toEqual([
        {
          id: 1,
          retrieval_collection_id: 1,
          name: 'Retrieval Order 1'
        },
        {
          id: 2,
          retrieval_collection_id: 1,
          name: 'Retrieval Order 2'
        }
      ])
    })
  })

  describe('users loader', () => {
    test('loads a user by ID', async () => {
      mockContext.databaseClient.getUsersById.mockResolvedValue([
        {
          id: 1,
          name: 'User 1'
        },
        {
          id: 2,
          name: 'User 2'
        },
        {
          id: 3,
          name: 'User 3'
        }
      ])

      const loaders = getLoaders(mockContext)
      const users = await loaders.users.load(1)

      expect(
        mockContext.databaseClient.getUsersById
      ).toHaveBeenCalledTimes(1)

      expect(
        mockContext.databaseClient.getUsersById
      ).toHaveBeenNthCalledWith(1, [1])

      expect(users).toEqual(
        {
          id: 1,
          name: 'User 1'
        }
      )
    })
  })
})
