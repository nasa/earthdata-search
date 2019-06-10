import * as appConfig from '../../../../../sharedUtils/config'
import { getValueForTag } from '../tags'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getValueForTag', () => {
  test('returns undefined when undefined is provided for tags', () => {
    const tagValue = getValueForTag('tag', undefined)
    expect(tagValue).toEqual(undefined)
  })

  test('returns undefined when an empty object is provided for tags', () => {
    const tagValue = getValueForTag('tag', {})
    expect(tagValue).toEqual(undefined)
  })
  
  test('returns undefined when an null is provided for tags', () => {
    const tagValue = getValueForTag('tag', null)
    expect(tagValue).toEqual(undefined)
  })

  test('returns a string when tag data is a string', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const tagData = {
      'edsc.test.tag': {
        data: 'tagValue'
      }
    }
    const tagValue = getValueForTag('tag', tagData)
    expect(tagValue).toEqual('tagValue')
  })

  test('returns an object when tag data is an object', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const tagData = {
      'edsc.test.tag': {
        data: {
          tagDataKey: 'tagDataValue'
        }
      }
    }
    const tagValue = getValueForTag('tag', tagData)
    expect(tagValue).toEqual({ tagDataKey: 'tagDataValue'})
  })

  test('returns an array when tag data is an array', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const tagData = {
      'edsc.test.tag': {
        data: [
          { tagDataKey1: 'tagDataValue1' },
          { tagDataKey2: 'tagDataValue2' }
        ]
      }
    }
    const tagValue = getValueForTag('tag', tagData)
    expect(tagValue).toEqual([{ tagDataKey1: 'tagDataValue1' }, { tagDataKey2: 'tagDataValue2' }])
  })
})
