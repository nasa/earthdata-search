import { queryToHumanizedList } from '../queryToHumanizedList'

describe('queryToHumanizedList', () => {
  test('returns a humanized param for hasGranulesOrCwic', () => {
    const query = {
      hasGranulesOrCwic: undefined
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'hasGranulesOrCwic',
      humanizedKey: 'Include datasets without granules'
    }])
  })

  test('returns a humanized param for EOSDIS consortium', () => {
    const query = {
      hasGranulesOrCwic: true,
      consortium: ['EOSDIS']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'consortium-EOSDIS',
      humanizedKey: 'Include only EOSDIS datasets'
    }])
  })

  test('returns a humanized param for Map Imagery tag', () => {
    const query = {
      hasGranulesOrCwic: true,
      tagKey: ['edsc.extra.serverless.gibs']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'tagKey-edsc.extra.serverless.gibs',
      humanizedKey: 'Include only datasets with map imagery'
    }])
  })

  test('returns a humanized param for Map Imagery tag when tagKey is not an array', () => {
    const query = {
      hasGranulesOrCwic: true,
      tagKey: 'edsc.extra.serverless.gibs'
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'tagKey-edsc.extra.serverless.gibs',
      humanizedKey: 'Include only datasets with map imagery'
    }])
  })

  test('returns a humanized param for Customizable', () => {
    const query = {
      hasGranulesOrCwic: true,
      serviceType: ['esi', 'opendap', 'harmony']
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'serviceType',
      humanizedKey: 'Include only datasets that support customization'
    }])
  })

  test('returns a humanized param for facets', () => {
    const query = {
      hasGranulesOrCwic: true,
      scienceKeywordsH: [{ topic: 'Oceans', term: 'Ocean Temperature' }]
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'scienceKeywordsH',
      humanizedKey: 'scienceKeywordsH',
      humanizedValue: [['Oceans', 'Ocean Temperature']]
    }])
  })

  test('returns a humanized param for keyword', () => {
    const query = {
      hasGranulesOrCwic: true,
      keyword: 'modis'
    }

    const subscriptionType = 'collection'

    const result = queryToHumanizedList(query, subscriptionType)

    expect(result).toEqual([{
      key: 'keyword',
      humanizedKey: 'keyword',
      humanizedValue: 'modis'
    }])
  })
})
