import { itemToRowColumnIndicies } from '../itemToRowColumnIndicies'

describe('itemToRowColumnIndicies', () => {
  describe('when given improper arguments', () => {
    test('returns undefined', () => {
      const result = itemToRowColumnIndicies('test', 'test')

      expect(result).toEqual(undefined)
    })
  })

  describe('when given valid arguments', () => {
    test('returns the correct value', () => {
      const result = itemToRowColumnIndicies(2, 2)

      expect(result).toEqual({
        rowIndex: 1,
        columnIndex: 0
      })
    })

    test('returns the correct value', () => {
      const result = itemToRowColumnIndicies(15, 3)

      expect(result).toEqual({
        rowIndex: 5,
        columnIndex: 0
      })
    })
  })
})
