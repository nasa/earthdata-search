import { buildHarmony } from '../buildHarmony'
import { getVariables, VariablesResult } from '../../getVariables'

// @ts-expect-error This file does not have types
import { getEarthdataConfig, getApplicationConfig } from '../../../../../../../sharedUtils/config'
import {
  DerivedHarmonyState,
  getDerivedHarmonyState,
  HarmonyCapabilitiesDocument,
  UserSelections
} from '../../../getDerivedHarmonyState/getDerivedHarmonyState'
import { HarmonyAccessMethod } from '../../../../zustand/types'

vi.mock('../../getVariables')
vi.mock('../../../../../../../sharedUtils/config')
vi.mock('../../../../util/getDerivedHarmonyState/getDerivedHarmonyState')

describe('buildHarmony', () => {
  const mockHarmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
    conceptId: 'C100000-EDSC',
    shortName: 'MOCK_SHORT_NAME',
    summary: {
      subsetting: {
        bbox: true,
        shape: true,
        temporal: true,
        variable: true
      },
      reprojection: {
        supportedProjections: [
          {
            name: 'Geographic',
            crs: 'EPSG:4313'
          }
        ]
      },
      concatenation: false,
      outputFormats: [
        {
          name: 'JSON',
          mimeType: 'application/json'
        }
      ]
    },
    services: [
      {
        name: 'giovanni-time-series-adapter',
        capabilities: {
          subsetting: {
            bbox: true,
            shape: true,
            temporal: true,
            variable: true
          },
          concatenation: false,
          reprojection: {
            supportedProjections: [
              {
                name: 'Geographic',
                crs: 'EPSG:4313'
              }
            ]
          },
          outputFormats: [
            {
              name: 'JSON',
              mimeType: 'application/json'
            }
          ]
        },
        href: 'example.com'
      }
    ],
    variables: [
      {
        name: 'Grid/cloudWaterContent',
        longName: 'cloudWaterContentLongName',
        href: 'example.com/V123',
        scienceKeywords: [],
        units: '123'
      }
    ]
  }

  const mockUserSelections: UserSelections = {
    spatialSubset: true
  }

  beforeEach(() => {
    vi.mocked(getVariables).mockReturnValue({
      hierarchyMappings: [{ id: 'mock-hierarchy' }],
      keywordMappings: [{
        children: [{ id: 'mock-keyword' }],
        label: 'mock-label'
      }],
      variables: {
        V123: {
          name: 'Grid/cloudWaterContent',
          longName: 'cloudWaterContentLongName',
          href: 'example.com/V123',
          scienceKeywords: [],
          units: '123'
        }
      }
    } satisfies VariablesResult)

    getEarthdataConfig.mockReturnValue({
      harmonyHost: 'https://harmony.example.com'
    })

    getApplicationConfig.mockReturnValue({
      env: 'prod'
    })

    vi.mocked(getDerivedHarmonyState).mockReturnValue({
      collectionId: 'C100000-EDSC',
      shortName: 'MOCK_SHORT_NAME',
      variables: [
        {
          name: 'Grid/cloudWaterContent',
          longName: 'cloudWaterContentLongName',
          href: 'example.com/V123',
          scienceKeywords: [],
          units: '123'
        }
      ],
      capabilities: {
        concatenate: {
          supported: false,
          disabled: true
        },
        reproject: {
          supported: [
            {
              name: 'Geographic',
              crs: 'EPSG:4313'
            }
          ],
          disabled: false,
          outputProjectionAvailability: { Geographic: true },
          value: ''
        },
        outputFormats: {
          outputFormatAvailability: { JSON: true },
          supported: [
            {
              mimeType: 'application/json',
              name: 'JSON'
            }],
          disabled: false,
          value: ''
        },
        temporalSubset: {
          supported: true,
          disabled: false
        },
        spatialSubset: {
          supported: true,
          disabled: false,
          shapeDisabled: true,
          bboxDisabled: false
        },
        variableSubset: {
          supported: true,
          disabled: false
        }
      }
    } satisfies DerivedHarmonyState)
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
      enableConcatenateDownload: false,
      // Set to true because userSelections have it enabled
      enableSpatialSubsetting: true,
      enableTemporalSubsetting: false,
      harmonyCapabilitiesDocument: {
        conceptId: 'C100000-EDSC',
        services: [
          {
            capabilities: {
              concatenation: false,
              outputFormats: [
                {
                  mimeType: 'application/json',
                  name: 'JSON'
                }
              ],
              reprojection: {
                supportedProjections: [
                  {
                    crs: 'EPSG:4313',
                    name: 'Geographic'
                  }
                ]
              },
              subsetting: {
                bbox: true,
                shape: true,
                temporal: true,
                variable: true
              }
            },
            href: 'example.com',
            name: 'giovanni-time-series-adapter'
          }
        ],
        shortName: 'MOCK_SHORT_NAME',
        summary: {
          concatenation: false,
          outputFormats: [
            {
              mimeType: 'application/json',
              name: 'JSON'
            }
          ],
          reprojection: {
            supportedProjections: [
              {
                crs: 'EPSG:4313',
                name: 'Geographic'
              }
            ]
          },
          subsetting: {
            bbox: true,
            shape: true,
            temporal: true,
            variable: true
          }
        },
        variables: [
          {
            href: 'example.com/V123',
            longName: 'cloudWaterContentLongName',
            name: 'Grid/cloudWaterContent',
            scienceKeywords: [],
            units: '123'
          }
        ]
      },
      harmonyUserSelections: {
        spatialSubset: true
      },
      derivedHarmonyState: {
        capabilities: {
          concatenate: {
            disabled: true,
            supported: false
          },
          outputFormats: {
            disabled: false,
            outputFormatAvailability: {
              JSON: true
            },
            supported: [
              {
                mimeType: 'application/json',
                name: 'JSON'
              }
            ],
            value: ''
          },
          reproject: {
            disabled: false,
            outputProjectionAvailability: {
              Geographic: true
            },
            supported: [
              {
                crs: 'EPSG:4313',
                name: 'Geographic'
              }
            ],
            value: ''
          },
          spatialSubset: {
            disabled: false,
            shapeDisabled: true,
            bboxDisabled: false,
            supported: true
          },
          temporalSubset: {
            disabled: false,
            supported: true
          },
          variableSubset: {
            disabled: false,
            supported: true
          }
        },
        collectionId: 'C100000-EDSC',
        shortName: 'MOCK_SHORT_NAME',
        variables: [
          {
            href: 'example.com/V123',
            longName: 'cloudWaterContentLongName',
            name: 'Grid/cloudWaterContent',
            scienceKeywords: [],
            units: '123'
          }
        ]
      },
      hierarchyMappings: [
        {
          id: 'mock-hierarchy'
        }
      ],
      id: 'C100000-EDSC',
      isConcatenationDisabled: true,
      isSpatialSubsettingDisabled: false,
      isTemporalSubsettingDisabled: false,
      isValid: true,
      isVariableSubsettingDisabled: false,
      keywordMappings: [
        {
          children: [
            {
              id: 'mock-keyword'
            }
          ],
          label: 'mock-label'
        }
      ],
      outputFormatAvailability: {
        JSON: true
      },
      outputProjectionAvailability: {
        Geographic: true
      },
      selectedOutputFormat: undefined,
      selectedOutputProjection: undefined,
      selectedVariables: [],
      shortName: 'MOCK_SHORT_NAME',
      supportedOutputFormats: [
        {
          mimeType: 'application/json',
          name: 'JSON'
        }
      ],
      supportedOutputProjections: [
        {
          crs: 'EPSG:4313',
          name: 'Geographic'
        }
      ],
      supportsConcatenation: false,
      supportsShapefileSubsetting: false,
      supportsSpatialSubsetting: true,
      supportsBoundingBoxSubsetting: true,
      supportsTemporalSubsetting: true,
      supportsVariableSubsetting: true,
      type: 'Harmony',
      url: 'https://harmony.example.com',
      variables: {
        V123: {
          href: 'example.com/V123',
          longName: 'cloudWaterContentLongName',
          name: 'Grid/cloudWaterContent',
          scienceKeywords: [],
          units: '123'
        }
      }
    } satisfies HarmonyAccessMethod)
  })
})
