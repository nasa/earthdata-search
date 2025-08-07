import { mapAutocompleteToFacets } from '../mapAutocompleteToFacets'

describe('mapAutocompleteToFacets', () => {
  test('maps science keywords autocomplete to facets', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Land Surface:Surface Radiative Properties:Reflectance:Laser Reflectance',
        type: 'science_keywords'
      }
    }

    const result = {
      science_keywords_h: {
        topic: 'Land Surface',
        term: 'Surface Radiative Properties',
        variable_level_1: 'Reflectance',
        variable_level_2: 'Laser Reflectance'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps science keywords autocomplete to facets when a facet level doesn\'t exist', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Land Surface:Surface Radiative Properties::Laser Reflectance',
        type: 'science_keywords'
      }
    }

    const result = {
      science_keywords_h: {
        topic: 'Land Surface',
        term: 'Surface Radiative Properties',
        variable_level_2: 'Laser Reflectance'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps platforms autocomplete to facets', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Space-based Platforms:Earth Observation Satellites:Landsat:LANDSAT-8',
        type: 'platforms'
      }
    }

    const result = {
      platforms_h: {
        basis: 'Space-based Platforms',
        category: 'Earth Observation Satellites',
        sub_category: 'Landsat',
        short_name: 'LANDSAT-8'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('maps platforms autocomplete to facets when a facet level doesn\'t exist', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Space-based Platforms:Earth Observation Satellites::LANDSAT-8',
        type: 'platforms'
      }
    }

    const result = {
      platforms_h: {
        basis: 'Space-based Platforms',
        category: 'Earth Observation Satellites',
        short_name: 'LANDSAT-8'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toEqual(result)
  })

  test('returns null for autocomplete suggestions that don\'t need mapping', () => {
    const autocomplete = {
      suggestion: {
        fields: 'Landsat',
        type: 'platform'
      }
    }

    expect(mapAutocompleteToFacets(autocomplete)).toBeNull()
  })
})
