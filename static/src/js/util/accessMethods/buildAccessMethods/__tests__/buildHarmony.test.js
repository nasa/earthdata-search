import { buildHarmony } from '../buildHarmony'

import { getEarthdataConfig } from '../../../../../../../sharedUtils/config'
import getDerivedHarmonyState from '../../../../util/getDerivedHarmonyState/getDerivedHarmonyState'

vi.mock('../../../../../../../sharedUtils/config')
vi.mock('../../../../util/getDerivedHarmonyState/getDerivedHarmonyState')

describe('buildHarmony', () => {
  const earthdataEnvironment = 'prod'

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
    getEarthdataConfig.mockReturnValue({
      harmonyHost: 'https://harmony.example.com'
    })

    getDerivedHarmonyState.mockReturnValue({
      collectionId: 'C4054955340-GES_DISC',
      shortName: 'GPM_3GPROFF18SSMIS_CLIM',
      capabilities: {
        concatenate: {
          supported: false,
          disabled: true
        },
        outputFormats: {
          availableOutputFormats: ['application/netcdf'],
          supported: ['application/netcdf', 'application/x-netcdf4'],
          disabled: false
        },
        temporalSubset: {
          supported: true,
          disabled: false
        },
        spatialSubset: {
          supported: true,
          disabled: false,
          bboxSupported: true,
          shapeSupported: false,
          shapeDisabled: true
        },
        variableSubset: {
          supported: true,
          disabled: false
        },
        variables: [
          {
            name: 'Grid/cloudWaterContent',
            href: 'https://example.com'
          }
        ]
      }
    })
  })

  test('builds the access method using the derived harmony state', () => {
    const result = buildHarmony(
      mockHarmonyCapabilitiesDocument,
      earthdataEnvironment,
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
      harmonyCapabilitiesDocument: mockHarmonyCapabilitiesDocument,
      defaultConcatenation: false,
      enableConcatenateDownload: false,
      enableSpatialSubsetting: true,
      enableTemporalSubsetting: false,
      id: 'C4054955340-GES_DISC',
      isValid: true,
      shortName: 'GPM_3GPROFF18SSMIS_CLIM',
      supportedOutputFormats: ['application/netcdf', 'application/x-netcdf4'],
      supportedOutputProjections: ['application/netcdf', 'application/x-netcdf4'],
      supportsBoundingBoxSubsetting: true,
      supportsConcatenation: false,
      supportsShapefileSubsetting: false,
      supportsTemporalSubsetting: true,
      supportsVariableSubsetting: true,
      isTemporalSubsettingDisabled: false,
      isSpatialSubsettingDisabled: false,
      isOutputFormatsDisabled: false,
      isShapeSubsettingDisabled: true,
      selectedOutputFormat: 'application/netcdf',
      type: 'Harmony',
      url: 'https://harmony.example.com',
      variables: [
        {
          name: 'Grid/cloudWaterContent',
          href: 'https://example.com'
        }
      ]
    })
  })
})
