import calculateValidParameters from '../calculateValidParameters'
import {
  mockServices,
  mockUserSelectionsTemporal,
  mockUserSelectionsSpatial,
  mockUserSelectionsOutputFormat,
  mockNoOutputFormatService
} from './__mocks__/mocks'

describe('calculateValidParameters', () => {
  test('returns empty object when services array is empty', () => {
    expect(calculateValidParameters(mockUserSelectionsTemporal, [])).toEqual({})
  })

  test('calculates parameters correctly when temporal subsetting is selected', () => {
    const result = calculateValidParameters(mockUserSelectionsTemporal, mockServices)

    // Giovanni-time-series-adapter and sds/HOSS-geographic support temporal.
    // sds/hoss-opendap-url DOES NOT.
    expect(result.temporalSubset.enabled).toBe(true)
    expect(result.variableSubset.enabled).toBe(true)
    expect(result.spatialSubset.enabled).toBe(true)
    expect(result.spatialSubset.bboxenabled).toBe(true)
    expect(result.spatialSubset.shapeenabled).toBe(true)
    // Formats of the 2 remaining valid services
    expect(result.outputFormats.enabledFormats).toEqual([
      'text/csv',
      'application/netcdf',
      'application/x-netcdf4'
    ])
  })

  test('calculates parameters correctly when spatial subsetting is selected', () => {
    const result = calculateValidParameters(mockUserSelectionsSpatial, mockServices)

    // Sds/HOSS-geographic and sds/hoss-opendap-url support spatial.
    // giovanni DOES NOT.
    expect(result.spatialSubset.enabled).toBe(true)
    expect(result.temporalSubset.enabled).toBe(true)
    // Formats of the 2 remaining valid services
    expect(result.outputFormats.enabledFormats).toEqual([
      'application/netcdf',
      'application/x-netcdf4',
      'application/x-netcdf4;profile=opendap_url'
    ])
  })

  test('ignores output format selection when generating enabledFormats to prevent dropdown collapse', () => {
    const result = calculateValidParameters(mockUserSelectionsOutputFormat, mockServices)

    // If user selects 'text/csv', only giovanni supports it.
    expect(result.variableSubset.enabled).toBe(true)
    expect(result.temporalSubset.enabled).toBe(true)

    // SpatialSubset drops to false because giovanni doesn't support it
    expect(result.spatialSubset.enabled).toBe(false)

    // EnabledFormats should STILL include all formats because it evaluates valid services
    // IGNORING the currently selected format
    expect(result.outputFormats.enabledFormats).toEqual([
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
      outputFormatSelection: undefined
    }

    const result = calculateValidParameters(selections, mockNoOutputFormatService)

    // The valid service (HOSS-geographic) has no formats
    expect(result.outputFormats.enabled).toBe(false)
    expect(result.outputFormats.enabledFormats).toEqual([])
  })
})
