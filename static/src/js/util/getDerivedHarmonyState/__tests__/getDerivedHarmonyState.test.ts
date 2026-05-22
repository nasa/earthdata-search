import getDerivedHarmonyState, { DerivedHarmonyState } from '../getDerivedHarmonyState'
import {
  mockHarmonyCapabilitiesDocument,
  mockUserSelectionsTemporal,
  mockUserSelectionsSpatial,
  mockUserSelectionsOutputFormat,
  mockUserSelectionsConcatenateSubsetting,
  mockUserSelectionsVariablesSubsetting,
  mockNoOutputFormatService
} from './__mocks__/mocks'

describe('getDerivedHarmonyState', () => {
  test('returns empty object when services array is empty', () => {
    expect(getDerivedHarmonyState(mockUserSelectionsTemporal, {
      conceptId: 'C1234567890-EEDTEST-NoServices',
      shortName: 'mock_collection',
      summary: {
        subsetting: {
          bbox: true,
          shape: true,
          temporal: true,
          variable: true
        },
        reprojection: {
          supported: false,
          supportedProjections: [],
          interpolationMethods: []
        },
        concatenation: false,
        outputFormats: []
      },
      services: [],
      variables: []
    })).toEqual({})
  })

  test('calculates parameters correctly when temporal subsetting is selected', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsTemporal,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // Giovanni-time-series-adapter and sds/HOSS-geographic support temporal.
    // sds/hoss-opendap-url DOES NOT.
    expect(result.capabilities.temporalSubset.disabled).toBe(false)
    expect(result.capabilities.variableSubset.disabled).toBe(false)
    expect(result.capabilities.spatialSubset.disabled).toBe(false)
    expect(result.capabilities.spatialSubset.bboxDisabled).toBe(false)
    expect(result.capabilities.spatialSubset.shapeDisabled).toBe(false)
    // Formats of the 2 remaining valid services
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({
      CSV: true,
      NetCDF: true,
      'NetCDF-4': true,
      'OPeNDAP URL': false
    })
  })

  test('calculates parameters correctly when spatial subsetting is selected', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsSpatial,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // Sds/HOSS-geographic and sds/hoss-opendap-url support spatial.
    // giovanni DOES NOT.
    expect(result.capabilities.spatialSubset.disabled).toBe(false)
    expect(result.capabilities.temporalSubset.disabled).toBe(false)
    // Formats of the 2 remaining valid services
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({
      CSV: false,
      NetCDF: true,
      'NetCDF-4': true,
      'OPeNDAP URL': true
    })
  })

  test('ignores output format selection when generating enabledFormats to prevent dropdown collapse', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsOutputFormat,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // If user selects 'text/csv', only giovanni supports it.
    expect(result.capabilities.temporalSubset.disabled).toBe(false)

    // SpatialSubset and Variable disabled becomes true because giovanni doesn't support them
    expect(result.capabilities.variableSubset.disabled).toBe(true)
    expect(result.capabilities.spatialSubset.disabled).toBe(true)

    // OutputFormatAvailability should STILL include all formats because it evaluates valid services
    // IGNORING the currently selected format
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({
      CSV: true,
      NetCDF: true,
      'NetCDF-4': true,
      'OPeNDAP URL': true
    })
  })

  test('disables output formats when the remaining valid services do not support any formats', () => {
    // Using the mock where 'sds/HOSS-geographic' has no output_formats array
    const selections = {
      spatialSubset: true, // Filters out giovanni, leaving only HOSS-geographic
      temporalSubset: false,
      concatenate: false,
      selectedOutputFormat: undefined
    }

    const result = getDerivedHarmonyState(
      selections,
      mockNoOutputFormatService
    ) as DerivedHarmonyState

    // The valid service (HOSS-geographic) has no formats
    expect(result.capabilities.outputFormats.disabled).toBe(false)
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({})
  })

  test('calculates parameters correctly when concatenate has been selected', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsConcatenateSubsetting,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // Only 'sds/hoss-opendap-url' supports concatenation, so the other two services are filtered out.
    expect(result.capabilities.concatenate.disabled).toBe(false)

    // 'sds/hoss-opendap-url' also supports bbox and variable subsetting, so those should remain enabled.
    expect(result.capabilities.spatialSubset.disabled).toBe(false)
    expect(result.capabilities.spatialSubset.bboxDisabled).toBe(false)
    expect(result.capabilities.variableSubset.disabled).toBe(false)

    // 'sds/hoss-opendap-url' DOES NOT support shape or temporal subsetting, so they must be disabled.
    expect(result.capabilities.spatialSubset.shapeDisabled).toBe(true)
    expect(result.capabilities.temporalSubset.disabled).toBe(true)

    // The only available output format should be from the remaining service
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({
      CSV: false,
      NetCDF: false,
      'NetCDF-4': false,
      'OPeNDAP URL': true
    })
  })

  test('calculates parameters correctly when a variable has been selected', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsVariablesSubsetting,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // Giovanni-time-series-adapter does not support variable subsetting, so it is filtered out.
    // Both HOSS-geographic and hoss-opendap-url support it.
    expect(result.capabilities.variableSubset.disabled).toBe(false)

    // Since both remaining services support bbox spatial subsetting, it remains enabled.
    expect(result.capabilities.spatialSubset.disabled).toBe(false)
    expect(result.capabilities.spatialSubset.bboxDisabled).toBe(false)

    // Only one of the remaining services supports shape subsetting, but since AT LEAST one does, it remains enabled.
    expect(result.capabilities.spatialSubset.shapeDisabled).toBe(false)

    // Only one of the remaining services supports concatenation, so it remains enabled.
    expect(result.capabilities.concatenate.disabled).toBe(false)

    // The available output formats should be from the TWO remaining services, NOT giovanni (meaning no CSV).
    expect(result.capabilities.outputFormats.outputFormatAvailability).toEqual({
      CSV: false,
      NetCDF: true,
      'NetCDF-4': true,
      'OPeNDAP URL': true
    })
  })
})
