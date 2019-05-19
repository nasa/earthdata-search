import moxios from 'moxios'
import jwt from 'jsonwebtoken'
import fs from 'fs'

import {
  pick,
  buildURL,
  doSearchRequest,
  prepareExposeHeaders
} from '../util'

const config = JSON.parse(fs.readFileSync('config.json'))

beforeEach(() => {
  jest.clearAllMocks()
})

describe('util#pick', () => {
  test('correctly returns when null is provided', () => {
    const data = pick(null, ['a'])

    expect(Object.keys(data).sort()).toEqual([])
  })

  test('correctly returns when undefined is provided', () => {
    const data = pick(undefined, ['a'])

    expect(Object.keys(data).sort()).toEqual([])
  })

  test('correctly picks whitelisted keys', () => {
    const object = {
      a: 1,
      b: 2,
      array: [1, 2, 3],
      obj: { c: 3 }
    }
    const desiredKeys = ['array', 'b']

    const data = pick(object, desiredKeys)

    expect(Object.keys(data).sort()).toEqual(['array', 'b'])
  })
})

describe('util#buildURL', () => {
  test('correctly builds a search URL', () => {
    process.env.cmrHost = 'http://example.com'

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
    expect(buildURL(params)).toEqual('http://example.com/search/path?param1=123&param2=abc&param3%5B%5D=987')
  })
})

describe('util#prepareExposeHeaders', () => {
  test('appends jwt-token to expose headers when they exist', () => {
    expect(prepareExposeHeaders({ 'access-control-expose-headers': 'header-1' })).toEqual('header-1, jwt-token')
  })

  test('returns jwt-token when no expose headers exist', () => {
    expect(prepareExposeHeaders({})).toEqual('jwt-token')
  })
})

xdescribe('util#doSearchRequest', () => {
  beforeEach(() => {
    moxios.install()

    jest.clearAllMocks()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  test('correctly returns the search response', async () => {
    moxios.stubRequest(/example.*/, {
      status: 200,
      response: {}
    })

    const token = {
      token: {
        access_token: '123'
      }
    }

    jest.spyOn(jwt, 'verify').mockImplementation(() => token)
    config.oauth.client.id = 'clientId'
    const jwtToken = '123.456.789'
    const url = 'http://example.com/search/path?param1=123&param2=abc&param3%5B%5D=987'

    // await doSearchRequest(jwtToken, url).then((data) => {
    //   expect(data).toEqual('data?')
    // })
    await expect(doSearchRequest(jwtToken, url)).resolves.toEqual('stuff?')
  })
})
