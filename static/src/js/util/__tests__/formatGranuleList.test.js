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
      browseFlag: false,
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
      isCwic: false,
      formattedTemporal: [
        '2020-08-13 00:00:00',
        '2020-08-14 00:00:00'
      ],
      thumbnail: 'https://cmr.earthdata.nasa.gov/browse-scaler/browse_images/granules/G1924512983-LANCEMODIS?h=85&w=85'
    }
  }
  const focusedGranuleId = ''
  const isGranuleInProject = jest.fn()
  const isCollectionInProject = false

  const { granulesList } = formatGranulesList({
    granuleIds,
    granulesMetadata,
    focusedGranuleId,
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
