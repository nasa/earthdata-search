import { colors, getColorByIndex } from '../colors'

describe('util#colors', () => {
  test('contains the correct color object', () => {
    expect(colors).toEqual({
      green: 'rgb(46, 204, 113, 1)',
      blue: 'rgb(52, 152, 219, 1)',
      orange: 'rgb(230, 126, 34, 1)',
      red: 'rgb(231, 76, 60, 1)',
      purple: 'rgb(155, 89, 182, 1)'
    })
  })

  describe('util#getColorByIndex', () => {
    describe('when color is in range', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(1)).toEqual('rgb(52, 152, 219, 1)')
      })
    })

    describe('when color is out of range', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(5)).toEqual('rgb(46, 204, 113, 1)')
      })
    })

    describe('when lighten is set to true', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(5, true)).toEqual('rgb(46, 204, 113, 0.5)')
      })
    })
  })
})
