import { buildAuthenticatedRedirectUrl } from '../buildAuthenticatedRedirectUrl'

describe('url#buildAuthenticatedRedirectUrl', () => {
  test('builds a url when no query params are provided', () => {
    expect(buildAuthenticatedRedirectUrl('http://edsc-test.com', 'abc.123.def'))
      .toEqual('http://localhost:3000/concepts/metadata?url=http://edsc-test.com&token=abc.123.def')
  })

  test('builds a url when provided query params', () => {
    expect(buildAuthenticatedRedirectUrl('http://edsc-test.com?some_param=string_value', 'abc.123.def'))
      .toEqual('http://localhost:3000/concepts/metadata?url=http://edsc-test.com?some_param=string_value&token=abc.123.def')
  })
})
