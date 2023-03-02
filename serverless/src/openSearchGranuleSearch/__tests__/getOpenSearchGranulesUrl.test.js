import nock from 'nock'

import { openSearchOsddErrorResponse, openSearchOsddResponse } from './mocks'
import { getOpenSearchGranulesUrl } from '../getOpenSearchGranulesUrl'

describe('getOpenSearchGranulesUrl', () => {
  test('successful returns a template for a known collection', async () => {
    nock(/wgiss/)
      .get(/opensearch/)
      .reply(200, openSearchOsddResponse)

    const response = await getOpenSearchGranulesUrl('C1597928934-NOAA_NCEI', 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev')

    const {
      statusCode,
      body
    } = response

    expect(statusCode).toEqual(200)
    expect(body).toEqual({
      indexOffset: '0',
      Parameter: [
        {
          minimum: '1',
          name: 'geoBox',
          title: 'inventory which has a spatial extent overlapping this bounding box',
          value: '{geo:box}'
        },
        {
          maxExclusive: '2020-07-11',
          minInclusive: '2018-11-07T00:00:00Z',
          minimum: '1',
          name: 'timeStart',
          title: 'inventory which has a temporal extent containing this start time',
          value: '{time:start}'
        },
        {
          maxInclusive: '2020-07-11',
          minExclusive: '2018-11-07T00:00:00Z',
          minimum: '1',
          name: 'timeEnd',
          title: 'inventory which has a temporal extent containing this end time',
          value: '{time:end}'
        },
        {
          minInclusive: '1',
          minimum: '0',
          name: 'startIndex',
          title: 'Index number of the set of search results desired by the search client',
          value: '{startIndex}'
        },
        {
          maxInclusive: '200',
          minInclusive: '1',
          minimum: '0',
          name: 'count',
          title: 'Number of search results per page desired by the search client',
          value: '{count}'
        }
      ],
      template: 'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&startIndex={startIndex?}&count={count?}&timeStart={time:start}&timeEnd={time:end}&geoBox={geo:box}&clientId=eed-edsc-dev',
      type: 'application/atom+xml'
    })
  })

  test('returns an error for an unknown collection', async () => {
    nock(/wgiss/)
      .get(/opensearch/)
      .reply(400, openSearchOsddErrorResponse, {
        'Content-Type': 'application/opensearchdescription+xml'
      })

    const response = await getOpenSearchGranulesUrl('C1597928934-SNOAA_NCEI', 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev')

    const {
      statusCode,
      body
    } = response

    expect(statusCode).toEqual(400)
    expect(body).toEqual(JSON.stringify({
      statusCode: 400,
      errors: ['REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset']
    }))
  })
})
