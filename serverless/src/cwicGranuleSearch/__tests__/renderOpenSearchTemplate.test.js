// import { cwicOsdd } from './mocks'

import { renderOpenSearchTemplate } from '../renderOpenSearchTemplate'

describe('renderOpenSearchTemplate', () => {
  test('', () => {
    const response = renderOpenSearchTemplate(
      'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
      {}
    )
    expect(response).toEqual('https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&clientId=eed-edsc-dev')
  })

  test('pageNum', () => {
    const response = renderOpenSearchTemplate(
      'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
      {
        pageNum: 2
      }
    )
    expect(response).toEqual('https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&startIndex=21&count=20&clientId=eed-edsc-dev')
  })

  test('boundingBox', () => {
    const response = renderOpenSearchTemplate(
      'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
      {
        boundingBox: [
          '-92.5751953125',
          '40.87545165175499',
          '-81.82891845703125',
          '49.49147977783035'
        ]
      }
    )
    expect(response).toEqual('https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&geoBox=-92.5751953125,40.87545165175499,-81.82891845703125,49.49147977783035&clientId=eed-edsc-dev')
  })

  test('point', () => {
    const response = renderOpenSearchTemplate(
      'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
      {
        point: '-92.5751953125,40.87545165175499'
      }
    )
    expect(response).toEqual('https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&geoBox=-92.5761953125,40.874451651754995,-92.57519531250.001,40.875451651754990.001&clientId=eed-edsc-dev')
  })

  test('temporal', () => {
    const response = renderOpenSearchTemplate(
      'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&amp;startIndex={startIndex?}&amp;count={count?}&amp;timeStart={time:start}&amp;timeEnd={time:end}&amp;geoBox={geo:box}&amp;clientId=eed-edsc-dev',
      {
        temporal: '2020-01-01T00%3A00%3A00.000Z,2020-02-01T23%3A59%3A59.999Z'
      }
    )
    expect(response).toEqual('https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&timeStart=2020-01-01T00%3A00%3A00Z&timeEnd=2020-02-01T23%3A59%3A59Z&clientId=eed-edsc-dev')
  })
})
