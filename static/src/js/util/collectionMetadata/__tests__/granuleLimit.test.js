import { getGranuleLimit } from '../granuleLimit'

describe('granuleLimit', () => {
  test('returns the granule limit if it exists', () => {
    const metadata = {
      tags: {
        'edsc.limited_collections': {
          data: {
            limit: 100
          }
        }
      }
    }
    expect(getGranuleLimit(metadata)).toEqual(100)
  })

  test('returns the app default if the tag does not exist', () => {
    const metadata = {
      tags: {}
    }
    expect(getGranuleLimit(metadata)).toEqual(1000000)
  })

  test('returns the app default if the metadata is empty', () => {
    expect(getGranuleLimit(undefined)).toEqual(1000000)
  })
})
