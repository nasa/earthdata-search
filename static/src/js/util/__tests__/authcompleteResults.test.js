import { buildHierarchy, buildHierarchicalAutocompleteTitle } from '../autocompleteResults'

describe('buildHierarchy', () => {
  test('correctly returns an empty result when no value is provided', () => {
    const hierarchy = buildHierarchy({})

    expect(hierarchy).toEqual([])
  })

  test('correctly returns an empty result when no hierarchy is present', () => {
    const hierarchy = buildHierarchy({ fields: 'nohiearchy' })

    expect(hierarchy).toEqual([])
  })

  test('correctly returns the value when hierarchy is present', () => {
    const hierarchy = buildHierarchy({ fields: 'grand parent:parent:child' })

    expect(hierarchy).toEqual([
      'grand parent',
      'parent'
    ])
  })

  test('correctly returns the value when hierarchy is present and child is requested', () => {
    const hierarchy = buildHierarchy({ fields: 'grand parent:parent:child', includeLeaf: true })

    expect(hierarchy).toEqual([
      'grand parent',
      'parent',
      'child'
    ])
  })
})

describe('buildHierarchicalAutocompleteTitle', () => {
  test('correctly returns an empty result when no values are provided', () => {
    const hierarchy = buildHierarchicalAutocompleteTitle({})

    expect(hierarchy).toEqual('')
  })

  describe('when only fields is provided', () => {
    test('correctly returns an empty result when fields are present', () => {
      const hierarchy = buildHierarchicalAutocompleteTitle({
        type: 'instrument',
        fields: 'MODIS'
      })

      expect(hierarchy).toEqual('Instrument:\nMODIS')
    })

    test('correctly returns the value when hierarchy is present', () => {
      const hierarchy = buildHierarchicalAutocompleteTitle({
        type: 'instrument',
        fields: 'grand parent:parent:child'
      })

      expect(hierarchy).toEqual('Instrument:\ngrand parent > parent > child')
    })
  })

  describe('when only value is provided', () => {
    test('correctly returns an empty result when fields are present', () => {
      const hierarchy = buildHierarchicalAutocompleteTitle({
        type: 'instrument',
        value: 'MODIS'
      })

      expect(hierarchy).toEqual('Instrument:\nMODIS')
    })
  })
})
