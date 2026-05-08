import getDerivedHarmonyState, { DerivedHarmonyState } from '../getDerivedHarmonyState'
import {
  mockHarmonyCapabilitiesDocument,
  mockUserSelectionsTemporal,
  mockUserSelectionsSpatial,
  mockUserSelectionsOutputFormat,
  mockNoOutputFormatService
} from './__mocks__/mocks'

describe('getDerivedHarmonyState', () => {
  test('returns empty object when services array is empty', () => {
    expect(getDerivedHarmonyState(mockUserSelectionsTemporal, {
      bboxSubset: true,
      concatenate: false,
      conceptId: 'C1234567890-EEDTEST-NoServices',
      reproject: false,
      outputFormats: [],
      services: [],
      shapeSubset: true,
      shortName: 'mock_collection',
      temporalSubset: true,
      variableSubset: true,
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
    expect(result.capabilities.outputFormats.availableOutputFormats).toEqual([
      'text/csv',
      'application/netcdf',
      'application/x-netcdf4'
    ])
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
    expect(result.capabilities.outputFormats.availableOutputFormats).toEqual([
      'application/netcdf',
      'application/x-netcdf4',
      'application/x-netcdf4;profile=opendap_url'
    ])
  })

  test('ignores output format selection when generating enabledFormats to prevent dropdown collapse', () => {
    const result = getDerivedHarmonyState(
      mockUserSelectionsOutputFormat,
      mockHarmonyCapabilitiesDocument
    ) as DerivedHarmonyState

    // If user selects 'text/csv', only giovanni supports it.
    expect(result.capabilities.variableSubset.disabled).toBe(false)
    expect(result.capabilities.temporalSubset.disabled).toBe(false)

    // SpatialSubset disabled becomes true because giovanni doesn't support it
    expect(result.capabilities.spatialSubset.disabled).toBe(true)

    // AvailableOutputFormats should STILL include all formats because it evaluates valid services
    // IGNORING the currently selected format
    expect(result.capabilities.outputFormats.availableOutputFormats).toEqual([
      'text/csv',
      'application/netcdf',
      'application/x-netcdf4',
      'application/x-netcdf4;profile=opendap_url'
    ])
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
    expect(result.capabilities.outputFormats.availableOutputFormats).toEqual([])
  })
})
