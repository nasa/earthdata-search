import request from 'request-promise'

import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as removeTag from '../removeTag'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('removeTag', () => {
  test('correctly calls cmr endpoint', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const cmrDeleteMock = jest.spyOn(request, 'delete').mockImplementation(() => jest.fn())

    await removeTag.removeTag(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(cmrDeleteMock).toBeCalledTimes(1)
    expect(cmrDeleteMock).toBeCalledWith({
      uri: 'http://example.com/search/tags/edsc.extra.gibs/associations/by_query',
      headers: {
        'Echo-Token': '1234-abcd-5678-efgh'
      },
      body: { short_name: 'MIL3MLS' },
      resolveWithFullResponse: true
    })
  })
})
