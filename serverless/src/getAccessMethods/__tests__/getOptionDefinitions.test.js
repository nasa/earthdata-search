import jwt from 'jsonwebtoken'
import nock from 'nock'

import { getOptionDefinitions } from '../getOptionDefinitions'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getOptionDefinitions', () => {
  test('fetches option definitions from CMR', async () => {
    nock(/cmr/)
      .get(/option_definitions/)
      .reply(200, {
        option_definition: {
          form: 'mock echo form'
        }
      })

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId', secret: 'secret' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ token: { access_token: 'access_token' } }))

    const optionDefinitions = [
      {
        id: 'option_def_guid',
        name: 'Option Definition'
      }
    ]

    const forms = await getOptionDefinitions(optionDefinitions, 'mockJwt')

    expect(forms).toEqual([
      {
        echoOrder0: {
          form: 'mock echo form',
          option_definition: {
            id: 'option_def_guid',
            name: 'Option Definition'
          },
          option_definitions: undefined
        }
      }
    ])
  })

  test('fetches multiple option definitions from CMR', async () => {
    nock(/cmr/)
      .get(/option_definitions/)
      .reply(200, {
        option_definition: {
          form: 'mock echo form 1'
        }
      })
    nock(/cmr/)
      .get(/option_definitions/)
      .reply(200, {
        option_definition: {
          form: 'mock echo form 2'
        }
      })

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId', secret: 'secret' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ token: { access_token: 'access_token' } }))

    const optionDefinitions = [
      {
        id: 'option_def_guid_1',
        name: 'Option Definition'
      },
      {
        id: 'option_def_guid_2',
        name: 'Option Definition'
      }
    ]

    const forms = await getOptionDefinitions(optionDefinitions, 'mockJwt')

    expect(forms).toEqual([
      {
        echoOrder0: {
          form: 'mock echo form 1',
          option_definition: {
            id: 'option_def_guid_1',
            name: 'Option Definition'
          },
          option_definitions: undefined
        }
      },
      {
        echoOrder1: {
          form: 'mock echo form 2',
          option_definition: {
            id: 'option_def_guid_2',
            name: 'Option Definition'
          },
          option_definitions: undefined
        }
      }
    ])
  })
})
