import { pick, getJwtToken } from '../util'

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

describe('util#getJwtToken', () => {
  test('correctly returns the JWT token when one is already set', () => {
    const token = '123.456.789'

    const event = {
      requestContext: {
        authorizer: {
          jwtToken: token
        }
      }
    }

    expect(getJwtToken(event)).toEqual('123.456.789')
  })
})
