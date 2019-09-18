import nock from 'nock'

import { getOptionDefinitions } from '../getOptionDefinitions'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'

beforeEach(() => {
  jest.clearAllMocks()

  nock.disableNetConnect()
})

afterEach(() => {
  nock.cleanAll()
  nock.enableNetConnect()
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

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

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
          form_digest: '948c584e60f9791b4d7b0e84ff538cd58ac8c0e4',
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

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

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
          form_digest: '9edb6f8f606fa9014402cf229751c03c35327135',
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
          form_digest: '26d076d6eeeb35e09c8b5581d32de368ae6f4892',
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
