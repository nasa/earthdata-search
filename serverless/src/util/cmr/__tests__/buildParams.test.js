import { buildParams } from '../buildParams'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'

describe('util#buildParams', () => {
  test('correctly builds a search URL as a string', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const body = '{"params":{"param1":123,"param2":"abc","param3":[987]}}'
    const permittedCmrKeys = [
      'param1',
      'param2',
      'param3'
    ]
    const nonIndexedKeys = [
      'param3'
    ]

    const params = {
      body,
      nonIndexedKeys,
      path: '/search/path',
      permittedCmrKeys
    }
    expect(buildParams(params)).toEqual('param1=123&param2=abc&param3%5B%5D=987')
  })

  test('correctly builds a search URL as an object', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const body = '{"params":{"param1":123,"param2":"abc","param3":[987]}}'
    const permittedCmrKeys = [
      'param1',
      'param2',
      'param3'
    ]
    const nonIndexedKeys = [
      'param3'
    ]

    const params = {
      body,
      nonIndexedKeys,
      path: '/search/path',
      permittedCmrKeys,
      stringifyResult: false
    }
    expect(buildParams(params)).toEqual({
      param1: 123,
      param2: 'abc',
      param3: [
        987
      ]
    })
  })
})
