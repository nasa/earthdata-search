import { chunkArray } from '../chunkArray'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('util#chunkArray', () => {
  test('correctly chunks an array of exact divisibility', () => {
    const largeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const chunkedArrays = chunkArray(largeArray, 2)

    expect(chunkedArrays).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10]
    ])
  })

  test('correctly chunks an array with left over values', () => {
    const largeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const chunkedArrays = chunkArray(largeArray, 3)

    expect(chunkedArrays).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [10]
    ])
  })
})
