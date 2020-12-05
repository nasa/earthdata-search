import { parseGraphQLError } from '../parseGraphQLError'

describe('parseGraphQLError', () => {
  describe('when an error is not present', () => {
    test('throws an exception', () => {
      expect(() => parseGraphQLError({
        data: {
          data: null
        }
      })).not.toThrow()
    })
  })

  describe('when an error is present', () => {
    test('throws an exception', () => {
      expect(() => parseGraphQLError({
        data: {
          errors: 'HTTP Response Error'
        }
      })).toThrow()
    })
  })
})
