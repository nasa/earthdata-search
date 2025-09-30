import buildPaginatedResult from '../buildPaginatedResult'

describe('buildPaginatedResult', () => {
  describe('with valid data', () => {
    test('should build correct pagination for first page', () => {
      const data = [
        {
          id: 1,
          name: 'Item 1',
          total: 6
        },
        {
          id: 2,
          name: 'Item 2',
          total: 6
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 2,
        offset: 0
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 3,
          hasNextPage: true,
          hasPreviousPage: false,
          currentPage: 1
        },
        count: 6
      })
    })

    test('should build correct pagination for middle page', () => {
      const data = [
        {
          id: 3,
          name: 'Item 3',
          total: 6
        },
        {
          id: 4,
          name: 'Item 4',
          total: 6
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 2,
        offset: 2
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 3,
          hasNextPage: true,
          hasPreviousPage: true,
          currentPage: 2
        },
        count: 6
      })
    })

    test('should build correct pagination for last page', () => {
      const data = [
        {
          id: 5,
          name: 'Item 5',
          total: 6
        },
        {
          id: 6,
          name: 'Item 6',
          total: 6
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 2,
        offset: 4
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 3,
          hasNextPage: false,
          hasPreviousPage: true,
          currentPage: 3
        },
        count: 6
      })
    })

    test('should handle single page scenario', () => {
      const data = [
        {
          id: 1,
          name: 'Item 1',
          total: 2
        },
        {
          id: 2,
          name: 'Item 2',
          total: 2
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 10,
        offset: 0
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          currentPage: 1
        },
        count: 2
      })
    })

    test('should handle large offset correctly', () => {
      const data = [
        {
          id: 91,
          name: 'Item 91',
          total: 100
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 10,
        offset: 90
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 10,
          hasNextPage: false,
          hasPreviousPage: true,
          currentPage: 10
        },
        count: 100
      })
    })
  })

  describe('with empty data', () => {
    test('should handle empty array', () => {
      const data = []
      const result = buildPaginatedResult({
        data,
        limit: 10,
        offset: 0
      })

      expect(result).toEqual({
        data: [],
        pageInfo: {
          pageCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          currentPage: null
        },
        count: 0
      })
    })

    test('should handle empty array with non-zero offset', () => {
      const data = []
      const result = buildPaginatedResult({
        data,
        limit: 10,
        offset: 20
      })

      expect(result).toEqual({
        data: [],
        pageInfo: {
          pageCount: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          currentPage: null
        },
        count: 0
      })
    })
  })

  describe('with different limit sizes', () => {
    test('should handle limit of 1', () => {
      const data = [
        {
          id: 1,
          name: 'Item 1',
          total: 5
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 1,
        offset: 0
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 5,
          hasNextPage: true,
          hasPreviousPage: false,
          currentPage: 1
        },
        count: 5
      })
    })

    test('should handle large limit', () => {
      const data = [
        {
          id: 1,
          name: 'Item 1',
          total: 5
        }
      ]
      const result = buildPaginatedResult({
        data,
        limit: 100,
        offset: 0
      })

      expect(result).toEqual({
        data,
        pageInfo: {
          pageCount: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          currentPage: 1
        },
        count: 5
      })
    })
  })

  test('should return correct structure with all required fields', () => {
    const data = [{
      id: 1,
      total: 10
    }]
    const result = buildPaginatedResult({
      data,
      limit: 5,
      offset: 0
    })

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('pageInfo')
    expect(result).toHaveProperty('count')

    expect(result.pageInfo).toHaveProperty('pageCount')
    expect(result.pageInfo).toHaveProperty('hasNextPage')
    expect(result.pageInfo).toHaveProperty('hasPreviousPage')
    expect(result.pageInfo).toHaveProperty('currentPage')

    expect(typeof result.pageInfo.pageCount).toBe('number')
    expect(typeof result.pageInfo.hasNextPage).toBe('boolean')
    expect(typeof result.pageInfo.hasPreviousPage).toBe('boolean')
    expect(typeof result.count).toBe('number')
  })

  test('should preserve original data array', () => {
    const originalData = [
      {
        id: 1,
        name: 'Item 1',
        total: 10
      },
      {
        id: 2,
        name: 'Item 2',
        total: 10
      }
    ]
    const result = buildPaginatedResult({
      data: originalData,
      limit: 5,
      offset: 0
    })

    expect(result.data).toBe(originalData)
    expect(result.data).toEqual(originalData)
  })
})
