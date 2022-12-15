import nock from 'nock'

import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getClientId from '../../../../sharedUtils/getClientId'
import * as removeTag from '../removeTag'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('removeTag', () => {
  test('correctly calls cmr endpoint', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .delete(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify({ short_name: 'MIL3MLS' }))
      .reply(200)

    const removeTagResponse = await removeTag.removeTag(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(removeTagResponse).toBe(true)
  })

  test('reports an error when calls to cmr fail', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    nock(/example/)
      .matchHeader('Authorization', 'Bearer 1234-abcd-5678-efgh')
      .delete(/search\/tags\/edsc\.extra\.gibs\/associations/, JSON.stringify({ short_name: 'MIL3MLS' }))
      .reply(500)

    const removeTagResponse = await removeTag.removeTag(
      'edsc.extra.gibs',
      { short_name: 'MIL3MLS' },
      '1234-abcd-5678-efgh'
    )

    expect(removeTagResponse).toBe(false)
  })
})
