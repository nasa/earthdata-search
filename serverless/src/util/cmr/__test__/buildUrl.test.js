import { buildURL } from '../buildUrl'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'


describe('util#buildURL', () => {
  test('correctly builds a search URL', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://example.com' }))

    const body = '{"params":{"param1":123,"param2":"abc","param3":["987"]}}'
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
    expect(buildURL(params)).toEqual('http://example.com/search/path.json?param1=123&param2=abc&param3%5B%5D=987')
  })
})
