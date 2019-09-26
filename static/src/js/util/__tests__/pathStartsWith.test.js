import { pathStartsWith } from '../pathStartsWith'

describe('pathStartsWith', () => {
  test('returns true when a path is matched', () => {
    expect(pathStartsWith('/test/path', '/test')).toEqual(true)
  })

  test('returns false with a path that does not match', () => {
    expect(pathStartsWith('/test/path', '/wrongtest')).toEqual(false)
  })
})
