import {
  createEcho10MetadataUrls,
  isDataLink,
  createDataLinks,
  createS3Links,
  getDownloadUrls,
  getS3Urls
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

describe('#createS3Links', () => {
  test('returns only s3 links', () => {
    const links = [
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 's3://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      },
      {
        rel: 'ftp://esipfed.org/ns/fedsearch/1.1/s3#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 's3://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
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
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 's3://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      },
      {
        rel: 'ftp://esipfed.org/ns/fedsearch/1.1/s3#',
        title: 'This link provides direct download access to the granule.',
        hreflang: 'en-US',
        href: 's3://daac.ornl.gov/daacdata/global_climate/global_N_deposition_maps/data/filename1.txt'
      }
    ]

    expect(createS3Links(links)).toEqual(expectedLinks)
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

describe('#getS3Urls', () => {
  test('returns an empty array when no links are found', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC'
    }]

    const s3Urls = getS3Urls(cmrGranuleResponse)

    expect(s3Urls).toEqual([])
  })

  test('returns the relevant link when only one is found', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
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

    const s3Urls = getS3Urls(cmrGranuleResponse)

    expect(s3Urls).toEqual([
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      }
    ])
  })

  test('returns relevant links when more than one is found across two graules', () => {
    const cmrGranuleResponse = [{
      id: 'C10000005-EDSC',
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
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
          rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
          type: 'application/x-hdfeos',
          title: 'This file may be downloaded directly from this link',
          hreflang: 'en-US',
          href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
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

    const s3Urls = getS3Urls(cmrGranuleResponse)

    expect(s3Urls).toEqual([
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      }, {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 's3://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
      }
    ])
  })
})

describe('getDownloadUrls', () => {
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
      {
        rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
        type: 'application/x-hdfeos',
        title: 'This file may be downloaded directly from this link',
        hreflang: 'en-US',
        href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h30v12.006.2015057072109.hdf'
      },
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
      }
    ])
  })
})
