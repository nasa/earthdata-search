import nock from 'nock'

import processTag from '../handler'
import * as addTag from '../addTag'
import * as removeTag from '../removeTag'
import * as deleteSystemToken from '../../util/urs/deleteSystemToken'
import * as getSystemToken from '../../util/urs/getSystemToken'

describe('processTag', () => {
  test('correctly defaults the Records array', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = vi.spyOn(addTag, 'addTag').mockImplementation(() => vi.fn())

    const event = {}

    await processTag(event, {})

    expect(addTagMock).toHaveBeenCalledTimes(0)
  })

  test('correctly calls addTag', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = vi.spyOn(addTag, 'addTag').mockImplementation(() => vi.fn())

    const searchCriteria = { short_name: 'MIL3MLS' }
    const tagData = { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }

    const event = {
      Records: [
        {
          body: JSON.stringify({
            tagName: 'edsc.extra.gibs',
            action: 'ADD',
            append: true,
            requireGranules: false,
            searchCriteria,
            tagData
          })
        }
      ]
    }

    await processTag(event, {})

    expect(addTagMock).toHaveBeenCalledTimes(1)
    expect(addTagMock).toHaveBeenCalledWith({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: 'mocked-system-token'
    })
  })

  test('doesnt call addTag when tagData matches current tagData', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = vi.spyOn(addTag, 'addTag').mockImplementation(() => vi.fn())

    const searchCriteria = {
      collection: {
        condition: {
          concept_id: 'C1000000-EDSC'
        }
      }
    }

    const tagData = { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' }

    nock(/cmr/)
      .post(/search\/concepts/)
      .reply(200, {
        id: 'C1000000-EDSC',
        tags: {
          'edsc.extra.gibs': {
            data: tagData
          }
        }
      })

    const event = {
      Records: [
        {
          body: JSON.stringify({
            tagName: 'edsc.extra.gibs',
            action: 'ADD',
            append: true,
            requireGranules: false,
            searchCriteria,
            tagData
          })
        }
      ]
    }

    await processTag(event, {})

    expect(addTagMock).toHaveBeenCalledTimes(0)
  })

  test('correctly call addTag when no searchCriteria is provided', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = vi.spyOn(addTag, 'addTag').mockImplementation(() => vi.fn())

    const tagData = {
      concept_id: 'C10000001-EDSC',
      data: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
    }

    const event = {
      Records: [
        {
          body: JSON.stringify({
            tagName: 'edsc.extra.gibs',
            action: 'ADD',
            append: true,
            requireGranules: false,
            tagData
          })
        }
      ]
    }

    await processTag(event, {})

    expect(addTagMock).toHaveBeenCalledTimes(1)
    expect(addTagMock).toHaveBeenCalledWith({
      tagName: 'edsc.extra.gibs',
      searchCriteria: {},
      tagData: {
        concept_id: 'C10000001-EDSC',
        data: 'AMSUA_NOAA15_Brightness_Temp_Channel_6'
      },
      requireGranules: false,
      append: true,
      cmrToken: 'mocked-system-token'
    })
  })

  test('doesnt call addTag when tagData matches current tagData when the difference is updated_at', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = vi.spyOn(addTag, 'addTag').mockImplementation(() => vi.fn())

    const searchCriteria = {
      collection: {
        condition: {
          concept_id: 'C1000000-EDSC'
        }
      }
    }

    const tagData = {
      product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6',
      updated_at: '2020-01-16T16:00:46.124Z'
    }

    nock(/cmr/)
      .post(/search\/concepts/)
      .reply(200, {
        id: 'C1000000-EDSC',
        tags: {
          'edsc.extra.gibs': {
            data: {
              ...tagData,
              updated_at: '2020-01-14T14:00:46.124Z'
            }
          }
        }
      })

    const event = {
      Records: [
        {
          body: JSON.stringify({
            tagName: 'edsc.extra.gibs',
            action: 'ADD',
            append: true,
            requireGranules: false,
            searchCriteria,
            tagData
          })
        }
      ]
    }

    await processTag(event, {})

    expect(addTagMock).toHaveBeenCalledTimes(0)
  })

  test('correctly calls removeTag', async () => {
    vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

    const removeTagMock = vi.spyOn(removeTag, 'removeTag').mockImplementation(() => vi.fn())

    const searchCriteria = { short_name: 'MIL3MLS' }

    const event = {
      Records: [
        {
          body: JSON.stringify({
            tagName: 'edsc.extra.gibs',
            action: 'REMOVE',
            searchCriteria
          })
        }
      ]
    }

    await processTag(event, {})

    expect(removeTagMock).toHaveBeenCalledTimes(1)
    expect(removeTagMock).toHaveBeenCalledWith(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      'mocked-system-token'
    )
  })
})
