import { prepareExposeHeaders } from '../prepareExposeHeaders'

describe('util#prepareExposeHeaders', () => {
  test('appends jwt-token to expose headers when they exist', () => {
    expect(prepareExposeHeaders({ 'access-control-expose-headers': 'header-1' })).toEqual('header-1, jwt-token')
  })

  test('returns jwt-token when no expose headers exist', () => {
    expect(prepareExposeHeaders({})).toEqual('jwt-token')
  })
})
