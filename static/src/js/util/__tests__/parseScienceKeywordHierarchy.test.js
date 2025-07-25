import { parseScienceKeywordHierarchy } from '../parseScienceKeywordHierarchy'

describe('parseScienceKeywordHierarchy', () => {
  test('maps full science keyword string with all levels', () => {
    const input = 'Land Surface:Surface Radiative Properties:Reflectance:Laser Reflectance:Detail Level:Extra Detail'

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({
      topic: 'Land Surface',
      term: 'Surface Radiative Properties',
      variable_level_1: 'Reflectance',
      variable_level_2: 'Laser Reflectance',
      variable_level_3: 'Detail Level',
      detailed_variable: 'Extra Detail'
    })
  })

  test('maps partial science keyword string', () => {
    const input = 'Land Surface:Surface Radiative Properties:Reflectance'

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({
      topic: 'Land Surface',
      term: 'Surface Radiative Properties',
      variable_level_1: 'Reflectance'
    })
  })

  test('handles empty values in the string', () => {
    const input = 'Land Surface::Reflectance'

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({
      topic: 'Land Surface',
      variable_level_1: 'Reflectance'
    })
  })

  test('handles single value', () => {
    const input = 'Land Surface'

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({
      topic: 'Land Surface'
    })
  })

  test('handles empty string', () => {
    const input = ''

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({})
  })

  test('handles string with only colons', () => {
    const input = ':::'

    const result = parseScienceKeywordHierarchy(input)

    expect(result).toEqual({})
  })
})
