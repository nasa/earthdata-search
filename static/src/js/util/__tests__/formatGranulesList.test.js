import { formatGranulesList } from '../formatGranulesList'

import * as EventEmitter from '../../events/events'

function setup(overrides) {
  const granuleIds = ['G1924512983-LANCEMODIS']
  const granulesMetadata = {
    'G1924512983-LANCEMODIS': {
      producerGranuleId: 'MOD09GA.A2020226.h06v03.006.2020227005059.NRT.hdf',
      timeStart: '2020-08-13T00:00:00.000Z',
      updated: '2020-08-14T00:51:23.212Z',
      datasetId: 'MODIS/Terra Near Real Time (NRT) Surface Reflectance Daily L2G Global 1km and 500m SIN Grid',
      dataCenter: 'LANCEMODIS',
      title: 'LANCEMODIS:1073941531',
      coordinateSystem: 'GEODETIC',
      dayNightFlag: 'UNSPECIFIED',
      timeEnd: '2020-08-14T00:00:00.000Z',
      id: 'G1924512983-LANCEMODIS',
      originalFormat: 'ECHO10',
      granuleSize: '5.89015102386475',
      browseFlag: true,
      polygons: [
        [
          '49.9154 -179.9921 49.916 -171.1374 52.3227 -170.9023 52.3246 179.7724 49.9154 -179.9921'
        ]
      ],
      collectionConceptId: 'C1219248410-LANCEMODIS',
      onlineAccessFlag: true,
      links: [
        {
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          type: 'application/x-hdfeos',
          hreflang: 'en-US',
          href: 'https://nrt3.modaps.eosdis.nasa.gov/archive/allData/6/MOD09GA/2020/226/MOD09GA.A2020226.h06v03.006.NRT.hdf'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/download-nrt-data/modis-nrt'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'http://lance3.modaps.eosdis.nasa.gov/data_products/'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
          hreflang: 'en-US',
          href: 'https://nrt3.modaps.eosdis.nasa.gov/archive/allData/6/MOD09GA'
        },
        {
          inherited: true,
          rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
          hreflang: 'en-US',
          href: 'http://modis.gsfc.nasa.gov/sci_team/'
        }
      ],
      isOpenSearch: false,
      formattedTemporal: [
        '2020-08-13 00:00:00',
        '2020-08-14 00:00:00'
      ],
      thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/G1924512983-LANCEMODIS?h=85&w=85'
    }
  }
  const focusedGranuleId = ''
  const hoveredGranuleId = null
  const isGranuleInProject = jest.fn()
  const isCollectionInProject = false

  const { granulesList } = formatGranulesList({
    granuleIds,
    granulesMetadata,
    focusedGranuleId,
    hoveredGranuleId,
    isGranuleInProject,
    isCollectionInProject,
    ...overrides
  })

  return {
    granulesList,
    granulesMetadata
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('granule map events', () => {
  test('hovering over a granule highlights the granule on the map', () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
    eventEmitterEmitMock.mockImplementation(() => jest.fn())

    const { granulesList, granulesMetadata } = setup()
    const [granule] = granulesList

    granule.handleMouseEnter()

    expect(eventEmitterEmitMock).toBeCalledTimes(1)
    expect(eventEmitterEmitMock).toBeCalledWith(
      'map.layer.C1219248410-LANCEMODIS.focusgranule', { granule: granulesMetadata['G1924512983-LANCEMODIS'] }
    )

    jest.clearAllMocks()

    granule.handleMouseLeave()
    expect(eventEmitterEmitMock).toBeCalledTimes(1)
    expect(eventEmitterEmitMock).toBeCalledWith('map.layer.C1219248410-LANCEMODIS.focusgranule', { granule: null })
  })

  test('sets isHoveredGranule for the correct granule', () => {
    const { granulesList } = setup({
      hoveredGranuleId: 'G1924512983-LANCEMODIS'
    })

    const [granule] = granulesList
    const { isHoveredGranule } = granule

    expect(isHoveredGranule).toEqual(true)
  })

  test('clicking on a granule sets that granule as sticky on the map', () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
    eventEmitterEmitMock.mockImplementation(() => jest.fn())

    const { granulesList, granulesMetadata } = setup()
    const [granule] = granulesList

    granule.handleClick()

    expect(eventEmitterEmitMock).toBeCalledTimes(1)
    expect(eventEmitterEmitMock).toBeCalledWith(
      'map.layer.C1219248410-LANCEMODIS.stickygranule', { granule: granulesMetadata['G1924512983-LANCEMODIS'] }
    )
  })

  test('clicking on a focused granule removes that granule as sticky on the map', () => {
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')
    eventEmitterEmitMock.mockImplementation(() => jest.fn())

    const { granulesList } = setup({ focusedGranuleId: 'G1924512983-LANCEMODIS' })
    const [granule] = granulesList

    granule.handleClick()

    expect(eventEmitterEmitMock).toBeCalledTimes(1)
    expect(eventEmitterEmitMock).toBeCalledWith('map.layer.C1219248410-LANCEMODIS.stickygranule', { granule: null })
  })
})

describe('granule metadata', () => {
  test('returns the producerGranuleId as title', () => {
    const { granulesList, granulesMetadata } = setup()

    expect(granulesList[0].title).toEqual(granulesMetadata['G1924512983-LANCEMODIS'].producerGranuleId)
    expect(granulesList[0].thumbnail).toEqual(granulesMetadata['G1924512983-LANCEMODIS'].thumbnail)
  })

  test('returns the title as title if producerGranuleId does not exist', () => {
    const granuleIds = ['http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc']
    const granulesMetadata = {
      'http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc': {
        title: 'C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc',
        id: 'http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc',
        'dc:identifier': 'http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc',
        updated: '2018-12-07',
        author: {
          name: 'DOC/NOAA/NESDIS/NCEI &gt; National Centers for Environmental Information, NESDIS, NOAA, U.S. Department of Commerce - TECHNICAL CONTACT - ;  ,  ;  - Email: NODC.DataOfficer@noaa.gov - Phone: 301-713-3272 - FAX:',
          email: 'NODC.DataOfficer@noaa.gov'
        },
        'georss:box': '-32.597469329833984 14.689370155334473 5.937497138977051 51.89847946166992',
        'georss:polygon': '-32.597469329833984 14.689370155334473 5.937497138977051 14.689370155334473 5.937497138977051 51.89847946166992 -32.597469329833984 51.89847946166992 -32.597469329833984 14.689370155334473',
        'dc:date': '2018-12-01/2018-12-01',
        link: [
          {
            title: 'HTTPS',
            rel: 'enclosure',
            type: 'application/octet-stream',
            href: 'https://data.nodc.noaa.gov/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc'
          },
          {
            title: 'FTP',
            rel: 'enclosure',
            type: 'application/octet-stream',
            href: 'ftp://ftp.nodc.noaa.gov/pub/data.nodc/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc'
          },
          {
            title: 'THREDDS OPeNDAP',
            rel: 'enclosure',
            type: 'application/octet-stream',
            href: 'https://data.nodc.noaa.gov/thredds/dodsC/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc.html'
          },
          {
            title: 'THREDDS(TDS)',
            rel: 'enclosure',
            type: 'application/octet-stream',
            href: 'https://data.nodc.noaa.gov/thredds/catalog/ghrsst/L2P/VIIRS_N20/OSPO/2018/335/catalog.html?dataset=ghrsst/L2P/VIIRS_N20/OSPO/2018/335/20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc'
          }
        ],
        summary: {
          '#text': 'Granule metadata for C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc',
          type: 'text'
        },
        isOpenSearch: true,
        timeStart: '2018-12-01',
        timeEnd: '2018-12-01',
        formattedTemporal: [
          '2018-12-01 05:00:00',
          null
        ],
        boxes: [
          '-32.597469329833984 14.689370155334473 5.937497138977051 51.89847946166992'
        ],
        browseFlag: false
      }
    }
    const { granulesList } = setup({ granuleIds, granulesMetadata })

    expect(granulesList[0].title).toEqual(granulesMetadata['http://cwic.wgiss.ceos.org/opensearch/granules.atom?uid=C1597928934-NOAA_NCEI:GHRSST-VIIRS_N20-OSPO-L2P.20181201112000-OSPO-L2P_GHRSST-SSTsubskin-VIIRS_N20-ACSPO_V2.60-v02.0-fv01.0.nc'].title)
  })

  test('returns the s3 links if they exist', () => {
    const granulesMetadata = {
      'G1924512983-LANCEMODIS': {
        producerGranuleId: 'MOD09GA.A2020226.h06v03.006.2020227005059.NRT.hdf',
        timeStart: '2020-08-13T00:00:00.000Z',
        updated: '2020-08-14T00:51:23.212Z',
        datasetId: 'MODIS/Terra Near Real Time (NRT) Surface Reflectance Daily L2G Global 1km and 500m SIN Grid',
        dataCenter: 'LANCEMODIS',
        title: 'LANCEMODIS:1073941531',
        coordinateSystem: 'GEODETIC',
        dayNightFlag: 'UNSPECIFIED',
        timeEnd: '2020-08-14T00:00:00.000Z',
        id: 'G1924512983-LANCEMODIS',
        originalFormat: 'ECHO10',
        granuleSize: '5.89015102386475',
        browseFlag: true,
        polygons: [
          [
            '49.9154 -179.9921 49.916 -171.1374 52.3227 -170.9023 52.3246 179.7724 49.9154 -179.9921'
          ]
        ],
        collectionConceptId: 'C1219248410-LANCEMODIS',
        onlineAccessFlag: true,
        links: [
          {
            rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
            type: 'application/x-hdfeos',
            hreflang: 'en-US',
            href: 'https://nrt3.modaps.eosdis.nasa.gov/archive/allData/6/MOD09GA/2020/226/MOD09GA.A2020226.h06v03.006.NRT.hdf'
          },
          {
            inherited: true,
            rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
            hreflang: 'en-US',
            href: 'https://earthdata.nasa.gov/earth-observation-data/near-real-time/download-nrt-data/modis-nrt'
          },
          {
            inherited: true,
            rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
            hreflang: 'en-US',
            href: 's3://lance3.modaps.eosdis.nasa.gov/data_products/'
          },
          {
            inherited: true,
            rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
            hreflang: 'en-US',
            href: 's3://nrt3.modaps.eosdis.nasa.gov/archive/allData/6/MOD09GA'
          },
          {
            inherited: true,
            rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
            hreflang: 'en-US',
            href: 'http://modis.gsfc.nasa.gov/sci_team/'
          }
        ],
        isOpenSearch: false,
        formattedTemporal: [
          '2020-08-13 00:00:00',
          '2020-08-14 00:00:00'
        ],
        thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/G1924512983-LANCEMODIS?h=85&w=85'
      }
    }
    const { granulesList } = setup({ granulesMetadata })

    expect(granulesList[0].s3Links).toEqual([
      {
        inherited: true,
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        hreflang: 'en-US',
        href: 's3://lance3.modaps.eosdis.nasa.gov/data_products/'
      },
      {
        inherited: true,
        rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
        hreflang: 'en-US',
        href: 's3://nrt3.modaps.eosdis.nasa.gov/archive/allData/6/MOD09GA'
      }
    ])
  })

  test('defaults the formattedTemporal', () => {
    const { granulesList } = setup({
      granuleIds: ['G10000-EDSC'],
      granulesMetadata: {
        'G10000-EDSC': {
          formattedTemporal: undefined
        }
      }
    })

    // Doesn't cause an error
    expect(granulesList[0].timeEnd).toEqual(undefined)
    expect(granulesList[0].timeStart).toEqual(undefined)
  })
})
