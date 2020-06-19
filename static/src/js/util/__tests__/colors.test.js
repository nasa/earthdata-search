import { colors, getColorByIndex } from '../colors'

describe('util#colors', () => {
  test('contains the correct color object', () => {
    expect(colors).toEqual({
      green: '#2ECC71',
      blue: '#3498DB',
      orange: '#E67E22',
      red: '#E74C3C',
      purple: '#9B59B6'
    })
  })

  describe('util#getColorByIndex', () => {
    describe('when color is in range', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(1)).toEqual('#3498DB')
      })
    })

    describe('when color is out of range', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(5)).toEqual('#2ECC71')
      })
    })

    describe('when lighten is set to true', () => {
      test('returns the correct color', () => {
        expect(getColorByIndex(5, true)).toEqual('rgb(46, 204, 113, 0.5)')
      })
    })
  })
})
