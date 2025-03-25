import { generateCacheKey } from '../generateCacheKey'

describe('generateCacheKey', () => {
  test('when provided a height and a width', () => {
    const cacheKey = generateCacheKey('C100000-EDSC', 'datasets', undefined, {
      height: 200,
      width: 200
    })

    expect(cacheKey).toEqual('C100000-EDSC-datasets-200-200')
  })

  test('when provided only a height', () => {
    const cacheKey = generateCacheKey('C100000-EDSC', 'datasets', undefined, {
      height: 200
    })

    expect(cacheKey).toEqual('C100000-EDSC-datasets-200-w')
  })

  test('when provided only a width', () => {
    const cacheKey = generateCacheKey('C100000-EDSC', 'datasets', undefined, {
      width: 200
    })

    expect(cacheKey).toEqual('C100000-EDSC-datasets-h-200')
  })

  test('when provided no dimensions', () => {
    const cacheKey = generateCacheKey('C100000-EDSC', 'datasets')

    expect(cacheKey).toEqual('C100000-EDSC-datasets-h-w')
  })

  test('when `imageSrc` is being passed', () => {
    const cacheKey = generateCacheKey('C100000-EDSC', 'datasets', 'https://example.com', {
      height: 20,
      width: 20
    })

    expect(cacheKey).toEqual('C100000-EDSC-datasets-20-20-https://example.com')
  })
})
