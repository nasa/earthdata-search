import { generateCacheKey } from '../generateCacheKey'

describe('generateCacheKey', () => {
  test('when provided a height and a width', () => {
    const cacheKey = generateCacheKey('http://test.com/test.jpg', {
      height: 200,
      width: 200
    })

    expect(cacheKey).toEqual('http://test.com/test.jpg-200-200')
  })

  test('when provided only a height', () => {
    const cacheKey = generateCacheKey('http://test.com/test.jpg', {
      height: 200
    })

    expect(cacheKey).toEqual('http://test.com/test.jpg-200-w')
  })

  test('when provided only a width', () => {
    const cacheKey = generateCacheKey('http://test.com/test.jpg', {
      width: 200
    })

    expect(cacheKey).toEqual('http://test.com/test.jpg-h-200')
  })

  test('when provided no dimensions', () => {
    const cacheKey = generateCacheKey('http://test.com/test.jpg')

    expect(cacheKey).toEqual('http://test.com/test.jpg-h-w')
  })
})
