import { buildHarmony } from '../buildHarmony'
import * as applicationConfig from '../../../../../../../sharedUtils/config'

vi.spyOn(applicationConfig, 'getEarthdataConfig').mockImplementation(() => ({
  harmonyHost: 'https://harmony.example.com'
}))

describe('buildHarmony', () => {
  test('returns a harmony access method with all capabilities enabled', () => {
    const mockHarmonyCapabilities = {
      bboxSubset: true,
      concatenate: true,
      conceptId: 'C10000-EDSC',
      outputFormats: ['text/csv', 'application/netcdf'],
      services: [
        {
          name: 'giovanni-time-series-adapter',
          capabilities: { subsetting: { temporal: true } }
        }
      ],
      shapeSubset: true,
      shortName: 'MOCK_HARMONY',
      temporalSubset: true,
      variables: [{
        conceptId: 'V10000-EDSC',
        name: 'Mock Variable'
      }],
      variableSubset: true
    }

    const accessMethod = buildHarmony(mockHarmonyCapabilities)

    expect(accessMethod).toEqual({
      defaultConcatenation: false,
      enableConcatenateDownload: false,
      enableSpatialSubsetting: false,
      enableTemporalSubsetting: false,
      id: 'C10000-EDSC',
      isValid: true,
      services: [
        {
          name: 'giovanni-time-series-adapter',
          capabilities: { subsetting: { temporal: true } }
        }
      ],
      shortName: 'MOCK_HARMONY',
      supportedOutputFormats: ['text/csv', 'application/netcdf'],
      supportedOutputProjections: [],
      supportsBoundingBoxSubsetting: true,
      supportsConcatenation: true,
      supportsShapefileSubsetting: true,
      supportsTemporalSubsetting: true,
      supportsVariableSubsetting: true,
      type: 'Harmony',
      url: 'https://harmony.example.com',
      variables: [{
        conceptId: 'V10000-EDSC',
        name: 'Mock Variable'
      }]
    })
  })

  test('returns a harmony access method with minimal capabilities enabled', () => {
    const mockHarmonyCapabilities = {
      bboxSubset: false,
      concatenate: false,
      conceptId: 'C20000-EDSC',
      outputFormats: [],
      services: [],
      shapeSubset: false,
      shortName: 'MINIMAL_HARMONY',
      temporalSubset: false,
      variables: [],
      variableSubset: false
    }

    const accessMethod = buildHarmony(mockHarmonyCapabilities)

    expect(accessMethod).toEqual({
      defaultConcatenation: false,
      enableConcatenateDownload: false,
      enableSpatialSubsetting: false,
      enableTemporalSubsetting: false,
      id: 'C20000-EDSC',
      isValid: true,
      services: [],
      shortName: 'MINIMAL_HARMONY',
      supportedOutputFormats: [],
      supportedOutputProjections: [],
      supportsBoundingBoxSubsetting: false,
      supportsConcatenation: false,
      supportsShapefileSubsetting: false,
      supportsTemporalSubsetting: false,
      supportsVariableSubsetting: false,
      type: 'Harmony',
      url: 'https://harmony.example.com',
      variables: []
    })
  })
})
