import * as appConfig from '../config'
import { tagName, getValueForTag, hasTag } from '../tags'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('tagName', () => {
  test('returns the correct tag name with default namespace', () => {
    const name = tagName('tag')
    expect(name).toEqual('edsc.extra.serverless.tag')
  })

  test('returns the correct tag name with provided namespace', () => {
    const name = tagName('tag', 'edsc.test')
    expect(name).toEqual('edsc.test.tag')
  })
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
    expect(tagValue).toEqual({ tagDataKey: 'tagDataValue' })
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

describe('hasTag', () => {
  test('returns true when the tag exists', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const collection = {
      tags: {
        'edsc.test.tag': {}
      }
    }

    const result = hasTag(collection, 'tag')
    expect(result).toBeTruthy()
  })

  test('returns false if the tag does not exist', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const collection = {
      tags: {
        'edsc.test.tag': {}
      }
    }

    const result = hasTag(collection, 'missing_tag')
    expect(result).toBeFalsy()
  })

  test('returns false if no tags exist', () => {
    jest.spyOn(appConfig, 'getApplicationConfig').mockImplementation(() => ({ cmrTagNamespace: 'edsc.test' }))

    const collection = {}

    const result = hasTag(collection, 'missing_tag')
    expect(result).toBeFalsy()
  })
})
