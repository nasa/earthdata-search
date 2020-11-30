import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  test('decodes focusedGranule correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedGranule: 'granuleId'
    }
    expect(decodeUrlParams('?g=granuleId')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes focusedGranule correctly', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedGranule: 'granuleId'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?g=granuleId')
  })
})
