import processTag from '../handler'
import * as addTag from '../addTag'
import * as removeTag from '../removeTag'
import * as getSystemToken from '../../util/urs/getSystemToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('processTag', () => {
  test('correctly defaults the Records array', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = jest.spyOn(addTag, 'addTag').mockImplementation(() => jest.fn())

    const event = {}

    await processTag(event, {})

    expect(addTagMock).toBeCalledTimes(0)
  })

  test('correctly calls addTag', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = jest.spyOn(addTag, 'addTag').mockImplementation(() => jest.fn())

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

    expect(addTagMock).toBeCalledTimes(1)
    expect(addTagMock).toBeCalledWith({
      tagName: 'edsc.extra.gibs',
      tagData: { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      searchCriteria: { short_name: 'MIL3MLS' },
      requireGranules: false,
      append: true,
      cmrToken: 'mocked-system-token'
    })
  })

  test('correctly calls removeTag', async () => {
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const removeTagMock = jest.spyOn(removeTag, 'removeTag').mockImplementation(() => jest.fn())

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

    expect(removeTagMock).toBeCalledTimes(1)
    expect(removeTagMock).toBeCalledWith(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      'mocked-system-token'
    )
  })
})
