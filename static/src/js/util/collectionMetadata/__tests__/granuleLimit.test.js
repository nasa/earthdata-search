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

  test('returns undefined if the tag does not exist', () => {
    const metadata = {
      tags: {}
    }
    expect(getGranuleLimit(metadata)).toEqual(undefined)
  })

  test('returns undefined if the metadata is empty', () => {
    expect(getGranuleLimit(undefined)).toEqual(undefined)
  })
})
