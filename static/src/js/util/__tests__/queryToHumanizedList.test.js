import { queryToHumanizedList } from '../queryToHumanizedList'

describe('queryToHumanizedList', () => {
  test('returns a humanized param for hasGranulesOrCwic', () => {
    const query = {
      hasGranulesOrCwic: undefined
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['hasGranulesOrCwic', 'Include datasets without granules']])
  })

  test('returns a humanized param for EOSDIS collections tag', () => {
    const query = {
      hasGranulesOrCwic: true,
      tagKey: ['gov.nasa.eosdis']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['tagKey-gov.nasa.eosdis', 'Include only EOSDIS datasets']])
  })

  test('returns a humanized param for Map Imagery tag', () => {
    const query = {
      hasGranulesOrCwic: true,
      tagKey: ['edsc.extra.serverless.gibs']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['tagKey-edsc.extra.serverless.gibs', 'Include only datasets with map imagery']])
  })

  test('returns a humanized param for Map Imagery tag', () => {
    const query = {
      hasGranulesOrCwic: true,
      serviceType: ['esi', 'opendap', 'harmony']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['serviceType', 'Include only datasets that support customization']])
  })

  test('returns a humanized param for facets', () => {
    const query = {
      hasGranulesOrCwic: true,
      scienceKeywordsH: [{ topic: 'Oceans', term: 'Ocean Temperature' }]
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['scienceKeywordsH', 'scienceKeywordsH', [['Oceans', 'Ocean Temperature']]]])
  })

  test('returns a humanized param for keyword', () => {
    const query = {
      hasGranulesOrCwic: true,
      keyword: 'modis'
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([['keyword', 'keyword', 'modis']])
  })
})
