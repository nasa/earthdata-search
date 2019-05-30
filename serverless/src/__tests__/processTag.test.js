import processTag from '../processTag'
import * as addTag from '../processTag/addTag'
import * as removeTag from '../processTag/removeTag'
import * as lambdaUtils from '../util'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('processTag', () => {
  test('correctly defaults the Records array', async () => {
    jest.spyOn(lambdaUtils, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

    const addTagMock = jest.spyOn(addTag, 'addTag').mockImplementation(() => jest.fn())

    const event = {}

    await processTag(event, {})

    expect(addTagMock).toBeCalledTimes(0)
  })

  test('correctly calls addTag', async () => {
    jest.spyOn(lambdaUtils, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

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
    expect(addTagMock).toBeCalledWith(
      'edsc.extra.gibs',
      { product: 'AMSUA_NOAA15_Brightness_Temp_Channel_6' },
      { short_name: 'MIL3MLS' },
      false,
      true,
      'mocked-system-token'
    )
  })

  test('correctly calls removeTag', async () => {
    jest.spyOn(lambdaUtils, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

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
