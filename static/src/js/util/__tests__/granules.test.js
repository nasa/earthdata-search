import {
  createEcho10MetadataUrls,
  isDataLink,
  createDataLinks
} from '../granules'

describe('createEcho10MetadataUrls', () => {
  describe('when provided a granule id', () => {
    test('returns the an object of metadata urls', () => {
      const data = createEcho10MetadataUrls('G1613627299-LANCEMODIS')
      const expectedData = {
        atom: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.atom',
          title: 'ATOM'
        },
        echo10: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.echo10',
          title: 'ECHO 10'
        },
        iso19115: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.iso19115',
          title: 'ISO 19115'
        },
        native: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS',
          title: 'Native'
        },
        umm_json: {
          href: 'https://cmr.earthdata.nasa.gov/search/concepts/G1613627299-LANCEMODIS.umm_json',
          title: 'UMM-G'
        }
      }

      expect(data).toEqual(expectedData)
    })
  })
})

describe('isDataLink', () => {
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

describe('createDataLinks', () => {
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
