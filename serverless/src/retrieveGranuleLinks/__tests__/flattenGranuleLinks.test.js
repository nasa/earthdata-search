import { flattenGranuleLinks } from '../flattenGranuleLinks'

describe('flattenGranuleLinks', () => {
  test('returns the provided links by default', () => {
    const links = {
      browse: [
        'http://example.com/browse'
      ],
      download: [
        'http://example.com/download'
      ],
      s3: [
        's3://example.com/download'
      ]
    }
    const linkTypes = []
    const flattenLinks = undefined

    const result = flattenGranuleLinks(links, linkTypes, flattenLinks)

    expect(result).toEqual(links)
  })

  test('returns the provided links if they should not be flattened', () => {
    const links = {
      browse: [
        'http://example.com/browse'
      ],
      download: [
        'http://example.com/download'
      ],
      s3: [
        's3://example.com/download'
      ]
    }
    const linkTypes = []
    const flattenLinks = 'false'

    const result = flattenGranuleLinks(links, linkTypes, flattenLinks)

    expect(result).toEqual(links)
  })

  test('returns flattened download links', () => {
    const links = {
      browse: [
        'http://example.com/browse'
      ],
      download: [
        'http://example.com/download'
      ],
      s3: [
        's3://example.com/download'
      ]
    }
    const linkTypes = ['data', 's3']
    const flattenLinks = 'true'

    const result = flattenGranuleLinks(links, linkTypes, flattenLinks)

    expect(result).toEqual([
      'http://example.com/download'
    ])
  })

  test('returns flattened browse links', () => {
    const links = {
      browse: [
        'http://example.com/browse'
      ],
      download: [
        'http://example.com/download'
      ],
      s3: [
        's3://example.com/download'
      ]
    }
    const linkTypes = ['browse']
    const flattenLinks = 'true'

    const result = flattenGranuleLinks(links, linkTypes, flattenLinks)

    expect(result).toEqual([
      'http://example.com/browse'
    ])
  })
})
