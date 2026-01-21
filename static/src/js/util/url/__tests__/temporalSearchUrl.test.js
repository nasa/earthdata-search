import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  vi.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
})

describe('url#decodeUrlParams', () => {
  test('decodes temporalSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          temporal: {
            endDate: '2019-02-01T00:00:00.000Z',
            startDate: '2019-01-01T00:00:00.000Z',
            recurringDayEnd: '',
            recurringDayStart: '',
            isRecurring: false
          }
        }
      }
    }
    expect(decodeUrlParams('?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes temporalSearch correctly', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true,
        temporal: {
          endDate: '2019-02-01T00:00:00.000Z',
          startDate: '2019-01-01T00:00:00.000Z'
        }
      },
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')
  })

  test('encodes temporalSearch correctly when isRecurring is provided', () => {
    const props = {
      collectionsQuery: {
        hasGranulesOrCwic: true,
        temporal: {
          endDate: '2019-02-01T00:00:00.000Z',
          startDate: '2019-01-01T00:00:00.000Z',
          recurringDayStart: '199',
          recurringDayEnd: '302',
          isRecurring: true
        }
      },
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z%2C199%2C302')
  })
})
