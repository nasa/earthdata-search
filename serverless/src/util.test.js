import {
  pick,
  objToQueryString
} from './util'

test('pick correctly returns when null is provided', () => {
  const data = pick(null, ['a'])

  expect(Object.keys(data).sort()).toEqual([])
})

test('pick correctly returns when undefined is provided', () => {
  const data = pick(undefined, ['a'])

  expect(Object.keys(data).sort()).toEqual([])
})

test('pick correctly whitelists keys', () => {
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

test('objToQueryString processes strings correctly', () => {
  const data = objToQueryString({ sort_key: ['name'] })
  expect(data).toBe('sort_key[]=name')
})

test('objToQueryString concatenates multiple values correctly', () => {
  const data = objToQueryString({ a: 'alpha', sort_key: ['name'] })
  expect(data).toBe('a=alpha&sort_key[]=name')
})

test('objToQueryString processes arrays correctly', () => {
  const data = objToQueryString({ sort_key: ['name'] })
  expect(data).toBe('sort_key[]=name')
})
