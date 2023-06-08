import { getBrowseUrls } from '../getBrowseUrls'

describe('getBrowseUrls', () => {
  test('returns an empty array when no links are found', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC'
    }]

    const browseUrls = getBrowseUrls(cmrGranuleResponse)

    expect(browseUrls).toEqual([])
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

    const browseUrls = getBrowseUrls(cmrGranuleResponse)

    expect(browseUrls).toEqual([
      'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
    ])
  })

  test('returns multiple links', () => {
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
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/browse#',
          type: 'image/jpeg',
          title: 'This Browse file may be downloaded directly from this link (BROWSE)',
          hreflang: 'en-US',
          href: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.2.jpg'
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

    const browseUrls = getBrowseUrls(cmrGranuleResponse)

    expect(browseUrls).toEqual([
      'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.2.jpg',
      'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2015.03.10/BROWSE.MOD11A1.A2000055.h20v06.006.2015057071544.1.jpg'
    ])
  })
})
