import { buildHarmony } from '../buildHarmony'
import { getHarmonyVariables } from '../../getVariables'

import { getEarthdataConfig, getApplicationConfig } from '../../../../../../../sharedUtils/config'
import getDerivedHarmonyState from '../../../../util/getDerivedHarmonyState/getDerivedHarmonyState'

vi.mock('../../getVariables')
vi.mock('../../../../../../../sharedUtils/config')
vi.mock('../../../../util/getDerivedHarmonyState/getDerivedHarmonyState')

describe('buildHarmony', () => {
  const mockHarmonyCapabilitiesDocument = {
    conceptId: 'C4054955340-GES_DISC',
    shortName: 'GPM_3GPROFF18SSMIS_CLIM'
  }

  const mockUserSelections = {
    spatialSubset: true,
    temporalSubset: false,
    outputFormat: 'application/netcdf'
  }

  beforeEach(() => {
    getHarmonyVariables.mockReturnValue({
      hierarchyMappings: [{ id: 'mock-hierarchy' }],
      keywordMappings: [{ id: 'mock-keyword' }],
      variables: {
        V123: { name: 'Grid/cloudWaterContent' }
      }
    })

    getEarthdataConfig.mockReturnValue({
      harmonyHost: 'https://harmony.example.com'
    })

    getApplicationConfig.mockReturnValue({
      env: 'prod'
    })

    getDerivedHarmonyState.mockReturnValue({
      collectionId: 'C4054955340-GES_DISC',
      shortName: 'GPM_3GPROFF18SSMIS_CLIM',
      capabilities: {
        concatenate: {
          supported: false,
          disabled: true,
          value: null
        },
        outputFormats: {
          availableOutputFormats: ['application/netcdf'],
          supported: ['application/netcdf', 'application/x-netcdf4'],
          disabled: false,
          value: 'application/netcdf'
        },
        temporalSubset: {
          supported: true,
          disabled: false,
          value: null
        },
        spatialSubset: {
          supported: true,
          disabled: false,
          bboxSupported: true,
          shapeSupported: false,
          shapeDisabled: true,
          value: null
        },
        variableSubset: {
          supported: true,
          disabled: false,
          value: null
        },
        variables: [
          {
            name: 'Grid/cloudWaterContent',
            href: 'https://example.com',
            scienceKeywords: []
          }
        ]
      }
    })
  })

  test('builds the access method using the derived harmony state', () => {
    const result = buildHarmony(
      mockHarmonyCapabilitiesDocument,
      mockUserSelections
    )

    expect(getEarthdataConfig).toHaveBeenCalledWith('prod')
    expect(getDerivedHarmonyState).toHaveBeenCalledWith(
      mockUserSelections,
      mockHarmonyCapabilitiesDocument
    )

    // Verify it correctly maps the derived state to the access method object
    expect(result).toEqual({
      availableOutputFormats: ['application/netcdf'],
      enableConcatenateDownload: false,
      enableSpatialSubsetting: true,
      enableTemporalSubsetting: false,
      harmonyCapabilitiesDocument: mockHarmonyCapabilitiesDocument,
      hierarchyMappings: [{ id: 'mock-hierarchy' }],
      id: 'C4054955340-GES_DISC',
      isOutputFormatsDisabled: false,
      isShapeSubsettingDisabled: true,
      isSpatialSubsettingDisabled: false,
      isTemporalSubsettingDisabled: false,
      isValid: true,
      isVariableSubsettingDisabled: false,
      keywordMappings: [{ id: 'mock-keyword' }],
      selectedOutputFormat: 'application/netcdf',
      selectedVariables: [],
      shortName: 'GPM_3GPROFF18SSMIS_CLIM',
      supportedOutputFormats: ['application/netcdf', 'application/x-netcdf4'],
      supportedOutputProjections: ['application/netcdf', 'application/x-netcdf4'],
      supportsBoundingBoxSubsetting: true,
      supportsConcatenation: false,
      supportsShapefileSubsetting: false,
      supportsTemporalSubsetting: true,
      supportsVariableSubsetting: true,
      type: 'Harmony',
      url: 'https://harmony.example.com',
      variables: {
        V123: { name: 'Grid/cloudWaterContent' }
      }
    })
  })
})
