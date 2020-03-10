import { commafy } from '../commafy'

describe('util#commafy', () => {
  describe('when passed a number with no decimals', () => {
    test('returns the correct string', () => {
      expect(commafy(1234556)).toEqual('1,234,556')
    })
  })
  describe('when passed a number with decimals', () => {
    test('returns the correct string', () => {
      expect(commafy(1234556.12393982)).toEqual('1,234,556.12393982')
    })
  })
  describe('when passed a string with no decimals', () => {
    test('returns the correct string', () => {
      expect(commafy('1234556')).toEqual('1,234,556')
    })
  })
  describe('when passed a string with decimals', () => {
    test('returns the correct string', () => {
      expect(commafy('1234556.12393982')).toEqual('1,234,556.12393982')
    })
  })
})
