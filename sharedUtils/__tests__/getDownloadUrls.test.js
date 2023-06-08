import { getDownloadUrls } from '../getDownloadUrls'

describe('getDownloadUrls', () => {
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
      'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
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
      'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf',
      'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
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
        }
      ]
    }, {
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-netcdf',
          hreflang: 'en-US',
          href: 'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014_Echogram.jpg'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-netcdf',
          hreflang: 'en-US',
          href: 'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014_Map.jpg'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-netcdf',
          hreflang: 'en-US',
          href: 'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014.nc'
        },
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          type: 'text/xml',
          title: '(METADATA)',
          hreflang: 'en-US',
          href: 'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014.xml'
        }
      ]
    }]

    const links = getDownloadUrls(cmrGranuleResponse)

    expect(links).toEqual([
      'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf',
      'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014_Echogram.jpg',
      'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014_Map.jpg',
      'https://n5eil01u.ecs.nsidc.org/DP4/ICEBRIDGE/IRACC1B.002/2017.11.25/IRACC1B_20171125_04_014.nc'
    ])
  })
})
