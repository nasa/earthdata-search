import { allVariablesSelected } from '../variables'

describe('allVariablesSelected', () => {
  describe('when no variables are selected', () => {
    test('returns an false', () => {
      const variables = [
        'Variable1',
        'Variable2',
        'Variable3',
        'Variable4'
      ]

      const selectedVariables = []

      expect(allVariablesSelected(variables, selectedVariables)).toEqual(false)
    })
  })

  describe('when some variables are selected', () => {
    test('returns an false', () => {
      const variables = [
        'Variable1',
        'Variable2',
        'Variable3',
        'Variable4'
      ]

      const selectedVariables = [
        'Variable1',
        'Variable2',
        'Variable4'
      ]

      expect(allVariablesSelected(variables, selectedVariables)).toEqual(false)
    })
  })

  describe('when all variables are selected', () => {
    test('returns an true', () => {
      const variables = [
        'Variable1',
        'Variable2',
        'Variable3',
        'Variable4'
      ]

      const selectedVariables = [
        'Variable1',
        'Variable2',
        'Variable3',
        'Variable4'
      ]

      expect(allVariablesSelected(variables, selectedVariables)).toEqual(true)
    })
  })
})
