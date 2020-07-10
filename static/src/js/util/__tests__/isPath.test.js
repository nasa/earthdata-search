import { isPath } from '../isPath'

describe('isPath', () => {
  describe('when no path is provided', () => {
    test('returns false', () => {
      expect(isPath('/test')).toEqual(false)
    })
  })

  describe('when passed a single level path', () => {
    describe('when testing against a single path', () => {
      test('returns true when a path is matched', () => {
        expect(isPath('/test', '/test')).toEqual(true)
      })

      test('returns false with a path that does not match', () => {
        expect(isPath('/test', '/wrongtest')).toEqual(false)
      })
    })

    describe('when testing against a multiple paths', () => {
      test('returns true when a path is matched', () => {
        expect(isPath('/test', ['/test', '/anothertest'])).toEqual(true)
      })

      test('returns false with a path that does not match', () => {
        expect(isPath('/test', ['/wrongtest', '/anotherwrongtest'])).toEqual(false)
      })
    })
  })

  describe('when passed a multi-level path', () => {
    describe('when testing against a single path', () => {
      test('returns true when a path is matched', () => {
        expect(isPath('/test/path', '/test/path')).toEqual(true)
      })

      test('returns false with a path that does not match', () => {
        expect(isPath('/test/path', '/wrongtest/path')).toEqual(false)
      })
    })

    describe('when testing against a multiple paths', () => {
      test('returns true when a path is matched', () => {
        expect(isPath('/test/path', ['/test/path', '/anothertest/path'])).toEqual(true)
      })

      test('returns false with a path that does not match', () => {
        expect(isPath('/test/path', ['/wrongtest/path', '/anotherwrongtest/path'])).toEqual(false)
      })
    })
  })

  describe('when passed a regex', () => {
    test('returns true when a path is matched', () => {
      expect(isPath('/test/this/one', /^\/test/)).toEqual(true)
    })

    test('returns false with a path that does not match', () => {
      expect(isPath('/nope', /^\/test/)).toEqual(false)
    })
  })

  describe('when passed a path with a trailing slash', () => {
    describe('when testing against a single path', () => {
      test('returns true when a path is matched', () => {
        expect(isPath('/test/', '/test')).toEqual(true)
      })

      test('returns false with a path that does not match', () => {
        expect(isPath('/test/', '/wrongtest')).toEqual(false)
      })
    })
  })
})
