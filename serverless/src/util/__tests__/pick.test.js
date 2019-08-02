import { pick } from '../pick'

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
