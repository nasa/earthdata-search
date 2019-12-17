import {
  createEcho10MetadataUrls,
  isDataLink,
  createDataLinks,
  getDownloadUrls,
  withAdvancedSearch
} from '../granules'

describe('#withAdvancedSearch', () => {
  describe('when no advanced search parameters are passed', () => {
    test('should return the collection params', () => {
      const collectionParams = {
        test: 'test'
      }
      const advancedSearch = {}
      const result = withAdvancedSearch(collectionParams, advancedSearch)

      expect(result).toEqual({
        test: 'test'
      })
    })
  })

  describe('when advanced search parameters are passed', () => {
    describe('when a region search is set', () => {
      test('should return the collection params with a modified polygon', () => {
        const originalPolygon = '1,2,3,4,1,2,3,4'
        const advSearchPolygon = '5,6,7,8,5,6,7,8'
        const collectionParams = {
          polygon: originalPolygon
        }
        const advancedSearch = {
          regionSearch: {
            selectedRegion: {
              spatial: advSearchPolygon
            }
          }
        }
        const result = withAdvancedSearch(collectionParams, advancedSearch)

        expect(result).toEqual({
          polygon: advSearchPolygon
        })
      })
    })
  })
})


describe('#createEcho10MetadataUrls', () => {
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

describe('#getDownloadUrls', () => {
  test('returns an empty array when no links are found', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC'
    }]

    const downloadUrls = getDownloadUrls(cmrGranuleResponse)

    expect(downloadUrls).toEqual([])
  })

  test('returns the relevant link when only one is found', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          type: 'text/html',
          title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
          hreflang: 'en-US',
          href: 'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'https://search.earthdata.nasa.gov/search?q=MOD11A1+V006'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          hreflang: 'en-US',
          href: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD11A1.006/contents.html'
        }
      ]
    }]

    const downloadUrls = getDownloadUrls(cmrGranuleResponse)

    expect(downloadUrls).toEqual([
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      }
    ])
  })

  test('returns relevant links when more than one is found across two graules', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          type: 'text/html',
          title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
          hreflang: 'en-US',
          href: 'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'https://search.earthdata.nasa.gov/search?q=MOD11A1+V006'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          hreflang: 'en-US',
          href: 'https://opendap.cr.usgs.gov/opendap/hyrax/MOD11A1.006/contents.html'
        }
      ]
    }, {
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
          type: 'text/html',
          title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
          hreflang: 'en-US',
          href: 'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
          type: 'image/jpeg',
          title: 'This Browse file may be downloaded directly from this link (BROWSE)',
          hreflang: 'en-US',
          href: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
        }
      ]
    }]

    const downloadUrls = getDownloadUrls(cmrGranuleResponse)

    expect(downloadUrls).toEqual([
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      }, {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
      }
    ])
  })
})
