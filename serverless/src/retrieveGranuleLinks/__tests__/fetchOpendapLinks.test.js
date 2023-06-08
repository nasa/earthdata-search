import nock from 'nock'
import { fetchOpendapLinks } from '../fetchOpendapLinks'

describe('fetchOpendapLinks', () => {
  test('returns a list of links', async () => {
    nock(/cmr/)
    // Ensure that the payload we're sending OUS is correct
      .post(/ous/, (body) => JSON.stringify(body) === JSON.stringify({
        format: 'nc4',
        variables: ['V1000004-EDSC'],
        page_size: '500',
        page_num: 1,
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
      }))
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })

    const result = await fetchOpendapLinks({
      accessMethod: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collectionId: 'C10000005-EDSC',
      earthdataEnvironment: 'prod',
      event: {
        headers: {},
        multiValueQueryStringParameters: {
          linkTypes: ['data', 's3']
        },
        queryStringParameters: {
          id: '1234567'
        }
      },
      granuleParams: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      pageNum: 1,
      requestId: '1234'
    })

    expect(result).toEqual([
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
      'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
    ])
  })

  test('returns a list of links with excluded granules', async () => {
    nock(/cmr/)
      // Ensure that the payload we're sending OUS is correct
      .post(/ous/, (body) => JSON.stringify(body) === JSON.stringify({
        format: 'nc4',
        variables: ['V1000004-EDSC'],
        page_size: '500',
        page_num: 1,
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        exclude_granules: true,
        granules: ['G10000404-EDSC']
      }))
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })

    const result = await fetchOpendapLinks({
      accessMethod: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collectionId: 'C10000005-EDSC',
      earthdataEnvironment: 'prod',
      event: {
        headers: {},
        multiValueQueryStringParameters: {
          linkTypes: ['data', 's3']
        },
        queryStringParameters: {
          id: '1234567'
        }
      },
      granuleParams: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'],
        exclude: {
          concept_id: ['G10000404-EDSC']
        }
      },
      pageNum: 1,
      requestId: '1234'
    })

    expect(result).toEqual([
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
      'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
    ])
  })

  test('returns a list of links when using additive model', async () => {
    nock(/cmr/)
      // Ensure that the payload we're sending OUS is correct
      .post(/ous/, (body) => JSON.stringify(body) === JSON.stringify({
        format: 'nc4',
        variables: ['V1000004-EDSC'],
        page_size: '500',
        page_num: 1,
        granules: ['G10000003-EDSC'],
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
      }))
      .reply(200, {
        items: [
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
          'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
          'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
        ]
      })

    const result = await fetchOpendapLinks({
      accessMethod: {
        type: 'OPeNDAP',
        selectedVariables: ['V1000004-EDSC'],
        selectedOutputFormat: 'nc4'
      },
      collectionId: 'C10000005-EDSC',
      earthdataEnvironment: 'prod',
      event: {
        headers: {},
        multiValueQueryStringParameters: {
          linkTypes: ['data', 's3']
        },
        queryStringParameters: {
          id: '1234567'
        }
      },
      granuleParams: {
        concept_id: ['G10000003-EDSC'],
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: ['23.607421875,5.381262277997806,27.7965087890625,14.973184553280502']
      },
      pageNum: 1,
      requestId: '1234'
    })

    expect(result).toEqual([
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.003.L2.RetStd.v6.0.7.0.G13075064534.hdf.nc',
      'https://f5eil01.edn.ecs.nasa.gov/opendap/DEV01/FS2/AIRS/AIRX2RET.006/2009.01.08/AIRS.2009.01.08.004.L2.RetStd.v6.0.7.0.G13075064644.hdf.nc',
      'https://airsl2.gesdisc.eosdis.nasa.gov/opendap/Aqua_AIRS_Level2/AIRX2RET.006/2009/008/AIRS.2009.01.08.005.L2.RetStd.v6.0.7.0.G13075064139.hdf.nc'
    ])
  })
})
