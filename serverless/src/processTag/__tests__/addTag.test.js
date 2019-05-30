import request from 'request-promise'

import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as addTag from '../addTag'
import * as getCollectionsByJson from '../getCollectionsByJson'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('addTag', () => {
  test('correctly calls cmr endpoint when no tag data existed', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
      entry: [{
        id: 'C123456789-EDSC',
        tags: {
          'edsc.extra.gibs': {}
        }
      }]
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when the tag is not already associated with the collection', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
      entry: [{
        id: 'C123456789-EDSC'
      }]
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when the tag data already exists', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when new tag data is provided', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when append is set to false', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      { short_name: 'MIL3MLS' },
      false,
      false,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when requireGranules is set to true (and append is set to true)', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' },
      { short_name: 'MIL3MLS' },
      true,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true, has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC',
          data: [
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
            { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_7' }
          ]
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when no tag data is provided', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      null,
      { short_name: 'MIL3MLS' },
      false,
      false,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(0)

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations/by_query',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: {
        short_name: 'MIL3MLS'
      },
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly calls cmr endpoint when no tag data is provided but granules are required', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
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
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      null,
      { short_name: 'MIL3MLS' },
      true,
      false,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true, has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(1)
    expect(cmrPostMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: [
        {
          'concept-id': 'C123456789-EDSC'
        }
      ],
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('does not call the cmr endpoint when tag data is provided but an error is returned from getCollectionsByJson', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const getCollectionsByJsonMock = jest.spyOn(getCollectionsByJson, 'getCollectionsByJson').mockImplementation(() => ({
      errors: ['This is a fake CMR error']
    }))

    const cmrPostMock = jest.spyOn(request, 'post').mockImplementation(() => jest.fn())

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    await addTag.addTag(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      '1234-abcd-5678-efgh'
    )

    expect(getCollectionsByJsonMock).toBeCalledTimes(1)
    expect(getCollectionsByJsonMock).toBeCalledWith(
      { include_tags: 'edsc.extra.gibs', include_has_granules: true },
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrPostMock).toBeCalledTimes(0)
    expect(consoleMock).toBeCalledTimes(1)
    expect(consoleMock).toBeCalledWith(['This is a fake CMR error'])
  })
})
