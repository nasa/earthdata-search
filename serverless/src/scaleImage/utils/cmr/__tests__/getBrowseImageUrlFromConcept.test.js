import { getBrowseImageUrlFromConcept } from '../getBrowseImageUrlFromConcept'

describe('getBrowseImageUrlFromConcept', () => {
  test('returns null when no links key is found in the metadata', () => {
    const conceptMetadata = {}

    const urls = getBrowseImageUrlFromConcept(conceptMetadata)

    expect(urls).toEqual(null)
  })

  test('returns null when the links key is an empty array', () => {
    const conceptMetadata = {
      links: []
    }

    const urls = getBrowseImageUrlFromConcept(conceptMetadata)

    expect(urls).toEqual(null)
  })

  test('returns null when links are found but none are browse images', () => {
    const conceptMetadata = {
      id: 'C100000-EDSC',
      links: [{
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        hreflang: 'en-US',
        href: 'https://daac.ornl.gov/daacdata/fife/document/hydrolgy/strm_15m.doc'
      }, {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        hreflang: 'en-US',
        href: 'https://daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/strm_15m.tdf'
      }]
    }

    const urls = getBrowseImageUrlFromConcept(conceptMetadata)

    expect(urls).toEqual(null)
  })

  test('returns a browse url when one is found', () => {
    const conceptMetadata = {
      id: 'C100000-EDSC',
      links: [{
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        hreflang: 'en-US',
        href: 'https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png'
      }]
    }

    const urls = getBrowseImageUrlFromConcept(conceptMetadata)

    expect(urls).toEqual('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
  })

  test('returns a browse url when one is found among multiple links', () => {
    const conceptMetadata = {
      id: 'C100000-EDSC',
      links: [{
        rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
        hreflang: 'en-US',
        href: 'https://daac.ornl.gov/daacdata/fife/data/hydrolgy/strm_15m/strm_15m.tdf'
      }, {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
        hreflang: 'en-US',
        href: 'https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png'
      }]
    }

    const urls = getBrowseImageUrlFromConcept(conceptMetadata)

    expect(urls).toEqual('https://daac.ornl.gov/graphics/browse/project/square/fife_logo_square.png')
  })
})
