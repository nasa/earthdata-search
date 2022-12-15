import nock from 'nock'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { addTag } from '../addTag'

beforeEach(() => {
  jest.restoreAllMocks()

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
})

describe('addTag', () => {
  test('correctly calls cmr endpoint when no tag data existed', async () => {
    nock(/example/)
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {}
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when the tag is not already associated with the collection', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC'
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when the tag data already exists', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when new tag data is provided', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }, {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('does not query cmr collections if search criteria is empty', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        { concept_id: 'C10000001-EDSC', data: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { concept_id: 'C10000001-EDSC', data: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: {},
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when append is set to false', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: false,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when requireGranules is set to true (and append is set to true)', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true&has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }, {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7'
            }
          ]
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: true,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when no tag data is provided', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations\/by_query/, JSON.stringify({
        short_name: 'MIL3MLS'
      }))
      .reply(200, {
        feed: {
          entry: [{
            id: 'C1234-EDSC',
            tags: {
              'edsc.extra.gibs': {}
            }
          }]
        }
      })

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: null,
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: false,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('correctly calls cmr endpoint when no tag data is provided but granules are required', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true&has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC'
        }
      ]))
      .reply(200, [])

    await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: null,
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: true,
      append: false,
      cmrToken: '1234-abcd-5678-efgh'
    })
  })

  test('does not call the cmr endpoint when tag data is provided but an error is returned from the collection search endpoint', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    await expect(addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })).rejects.toThrow('Request failed with status code 500')
  })

  test('does not call the cmr endpoint when tag data is provided but an error is returned from the collection search endpoint', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'C123456789-EDSC',
            tags: {
              'edsc.extra.gibs': {
                data: [{
                  product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
                }]
              }
            }
          }]
        }
      })

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify([
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            {
              product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
            }
          ]
        }
      ]))
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    await expect(addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })).rejects.toThrow('Request failed with status code 500')
  })

  test('does not call the cmr endpoint when tag data is provided but no collections are returned from the collection search endpoint', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post('/search/collections.json?include_tags=edsc.extra.gibs&include_has_granules=true', {
        short_name: 'MIL3MLS'
      })
      .reply(200, {
        feed: {
          entry: []
        }
      })

    const result = await addTag({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: '1234-abcd-5678-efgh'
    })

    expect(result).toBeFalsy()
  })

  test('correctly calls cmr endpoint when no tag data is provided', async () => {
    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .post(/search\/tags\/edsc\.extra\.gibs\/associations\/by_query/, JSON.stringify({
        short_name: 'MIL3MLS'
      }))
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    await expect(addTag({
      tagName: 'edsc.extra.gibs',
      tagData: null,
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: false,
      cmrToken: '1234-abcd-5678-efgh'
    })).rejects.toThrow('Request failed with status code 500')
  })
})
