import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'
import * as getClientId from '../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { getCmrPreferencesData } from '../getCmrPreferencesData'

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getCmrPreferencesData', () => {
  test('correctly requests a users data from cmr-ordering', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.com' }))

    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ background: 'eed-edsc-test-serverless-background' }))

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer fake.access.token')
      .matchHeader('Client-Id', 'eed-edsc-test-serverless-background')
      .matchHeader('X-Request-Id', 'mock-request-id')
      .post(/ordering\/api/)
      .reply(200, {
        data: {
          user: {
            ursId: 'urs_user',
            notificationLevel: 'INFO'
          }
        }
      })

    const cmrData = await getCmrPreferencesData('urs_user', 'fake.access.token')

    expect(cmrData).toEqual({
      ursId: 'urs_user',
      notificationLevel: 'INFO'
    })
  })
})
