import { emptyDecodedResult } from './url.mocks'

import { decodeUrlParams, encodeUrlQuery } from '../url'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeAutocomplete', () => {
  test('decodes autocompleteSelected correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      autocompleteSelected: [
        { type: 'platform', fields: 'aqua', value: 'aqua' },
        { type: 'platform', fields: 'terra', value: 'terra' },
        { type: 'instrument', fields: 'modis', value: 'modis' }
      ]
    }
    expect(decodeUrlParams('?as[platform][0]=aqua&as[platform][1]=terra&as[instrument][0]=modis')).toEqual(expectedResult)
  })
})

describe('url#encodeAutocomplete', () => {
  test('does not encode the value if there are no autocomplete selected params', () => {
    const props = {
      autocompleteSelected: [],
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes autocompleteSelected correctly', () => {
    const props = {
      autocompleteSelected: [
        { type: 'platform', fields: 'aqua', value: 'aqua' },
        { type: 'platform', fields: 'terra', value: 'terra' },
        { type: 'instrument', fields: 'modis', value: 'modis' }
      ],
      hasGranulesOrCwic: true,
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?as[platform][0]=aqua&as[platform][1]=terra&as[instrument][0]=modis')
  })
})
