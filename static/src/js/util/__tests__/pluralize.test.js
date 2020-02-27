import { pluralize } from '../pluralize'

describe('util#pluralize', () => {
  describe('when given no value', () => {
    test('returns the correct string', () => {
      expect(pluralize('test')).toEqual('test')
    })
  })
  describe('when given value of 0', () => {
    test('returns the correct string', () => {
      expect(pluralize('test', 0)).toEqual('tests')
    })
  })
  describe('when given value of 1', () => {
    test('returns the correct string', () => {
      expect(pluralize('test', 1)).toEqual('test')
    })
  })
  describe('when given value greater than 1', () => {
    test('returns the correct string', () => {
      expect(pluralize('test', 2)).toEqual('tests')
    })
  })
})
