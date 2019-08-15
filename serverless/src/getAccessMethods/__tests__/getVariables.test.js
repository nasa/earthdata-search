import jwt from 'jsonwebtoken'
import nock from 'nock'

import { getVariables } from '../getVariables'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import { variablesResponse, mockKeywordMappings, mockVariables } from './mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getVariables', () => {
  test('fetches variables from CMR', async () => {
    nock(/cmr/)
      .post(/variables.umm_json/)
      .reply(200, variablesResponse)

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId', secret: 'secret' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ token: { access_token: 'access_token' } }))

    const variableIds = ['V1200279061-E2E_18_4', 'V1200279065-E2E_18_4', 'V1200279073-E2E_18_4', 'V1200279049-E2E_18_4', 'V1200279069-E2E_18_4', 'V1200279053-E2E_18_4', 'V1200279060-E2E_18_4', 'V1200279039-E2E_18_4', 'V1200279057-E2E_18_4', 'V1200279056-E2E_18_4', 'V1200279072-E2E_18_4', 'V1200279035-E2E_18_4', 'V1200279044-E2E_18_4', 'V1200279075-E2E_18_4', 'V1200279038-E2E_18_4', 'V1200279052-E2E_18_4', 'V1200279048-E2E_18_4', 'V1200279034-E2E_18_4', 'V1200279064-E2E_18_4', 'V1200279041-E2E_18_4', 'V1200279068-E2E_18_4', 'V1200279045-E2E_18_4']

    const { keywordMappings, variables } = await getVariables(variableIds, 'mockJwt')

    expect(keywordMappings).toEqual(mockKeywordMappings)
    expect(variables).toEqual(mockVariables)
  })
})
