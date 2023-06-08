import {
  createDataLinks,
  createEcho10MetadataUrls,
  isDataLink,
  prepareGranuleParams
} from '../granules'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

describe('#createEcho10MetadataUrls', () => {
  describe('when provided a granule id', () => {
    test('returns the an object of metadata urls', () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))

      const data = createEcho10MetadataUrls('G1613627299-LANCEMODIS')
      const expectedData = {
        atom: {
          href: 'http://cmr.example.com/search/concepts/G1613627299-LANCEMODIS.atom',
          title: 'ATOM'
        },
        echo10: {
          href: 'http://cmr.example.com/search/concepts/G1613627299-LANCEMODIS.echo10',
          title: 'ECHO 10'
        },
        iso19115: {
          href: 'http://cmr.example.com/search/concepts/G1613627299-LANCEMODIS.iso19115',
          title: 'ISO 19115'
        },
        native: {
          href: 'http://cmr.example.com/search/concepts/G1613627299-LANCEMODIS',
          title: 'Native'
        },
        umm_json: {
          href: 'http://cmr.example.com/search/concepts/G1613627299-LANCEMODIS.umm_json',
          title: 'UMM-G'
        }
      }

      expect(data).toEqual(expectedData)
    })
  })
})

describe('#isDataLink', () => {
  test('returns true http data links', () => {
    const link = {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
      title: 'This link provides direct download access to the granule.',
      hreflang: 'en-US',
      href: 'https://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/NHx-deposition2050.txt'
    }

    expect(isDataLink(link, 'http')).toBeTruthy()
  })

  test('returns true ftp data links', () => {
    const link = {
      rel: 'ftp://esipfed.org/ns/fedsearch/1.1/data#',
      title: 'This link provides direct download access to the granule.',
      hreflang: 'en-US',
      href: 'ftp://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/NHx-deposition2050.txt'
    }

    expect(isDataLink(link, 'ftp')).toBeTruthy()
  })

  test('returns false non-inherited links', () => {
    const link = {
      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
      title: 'This link provides direct download access to the granule.',
      hreflang: 'en-US',
      href: 'http://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/NHx-deposition2050.txt',
      inherited: true
    }

    expect(isDataLink(link, 'http')).toBeFalsy()
  })

  test('returns false non-data links', () => {
    const link = {
      rel: 'http://esipfed.org/ns/fedsearch/1.1',
      title: 'This link provides direct download access to the granule.',
      hreflang: 'en-US',
      href: 'http://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/NHx-deposition2050.txt'
    }

    expect(isDataLink(link, 'http')).toBeFalsy()
  })
})

describe('#createDataLinks', () => {
  test('returns only data links, prefering http over ftp for matching filenames', () => {
    const links = [
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 'http://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      },
      {
        rel: 'ftp://esipfed.org/ns/fedsearch/1.1/data#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 'ftp://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      },
      {
        rel: 'ftp://esipfed.org/ns/fedsearch/1.1/data#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 'ftp://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename2.txt'
      }
    ]

    const expectedLinks = [
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 'http://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      },
      {
        rel: 'ftp://esipfed.org/ns/fedsearch/1.1/data#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 'ftp://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename2.txt'
      }
    ]

    expect(createDataLinks(links)).toEqual(expectedLinks)
  })
})

describe('#prepareGranuleParams', () => {
  describe('options parameter', () => {
    test('adds correct options when multiple spatial exists', () => {
      const params = prepareGranuleParams({}, {
        point: [
          38.8048355,
          -77.0469214
        ],
        bounding_box: [
          -77.0372879,
          -77.144359,
          38.845011,
          38.785216
        ],
        granuleTemporal: {},
        overrideTemporal: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          spatial: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when temporal exists', () => {
      const params = prepareGranuleParams({}, {
        readableGranuleName: 'mockId',
        granuleTemporal: {},
        overrideTemporal: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          readableGranuleName: {
            pattern: true
          }
        }
      }))
    })
  })
})
