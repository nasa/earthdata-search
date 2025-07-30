import { parsePlatformHierarchy } from '../parsePlatformHierarchy'

describe('parsePlatformHierarchy', () => {
  test('maps full platform string with all levels', () => {
    const input = 'Space-based Platforms:Earth Observation Satellites:Landsat:LANDSAT-8'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({
      basis: 'Space-based Platforms',
      category: 'Earth Observation Satellites',
      sub_category: 'Landsat',
      short_name: 'LANDSAT-8'
    })
  })

  test('maps partial platform string', () => {
    const input = 'Space-based Platforms:Earth Observation Satellites'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({
      basis: 'Space-based Platforms',
      category: 'Earth Observation Satellites'
    })
  })

  test('handles empty values in the string', () => {
    const input = 'Space-based Platforms::LANDSAT-8'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({
      basis: 'Space-based Platforms',
      sub_category: 'LANDSAT-8'
    })
  })

  test('handles single value', () => {
    const input = 'Space-based Platforms'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({
      basis: 'Space-based Platforms'
    })
  })

  test('handles empty string', () => {
    const input = ''

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({})
  })

  test('handles string with only colons', () => {
    const input = ':::'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({})
  })

  test('maps aircraft platform', () => {
    const input = 'Air-based Platforms:Aircraft:DC-8'

    const result = parsePlatformHierarchy(input)

    expect(result).toEqual({
      basis: 'Air-based Platforms',
      category: 'Aircraft',
      sub_category: 'DC-8'
    })
  })
})
