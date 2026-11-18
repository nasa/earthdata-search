import { buildAccessMethods } from '../buildAccessMethods'

// @ts-expect-error This file does not have types
import * as buildDownload from '../buildAccessMethods/buildDownload'
import * as buildHarmony from '../buildAccessMethods/buildHarmony'

// @ts-expect-error This file does not have types
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import {
  DerivedHarmonyState,
  HarmonyCapabilitiesDocument
} from '../../getDerivedHarmonyState/derivedHarmonyStateTypes'

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    env: 'test'
  }))
})

const harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
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
      supportedProjections: []
    },
    concatenation: false,
    outputFormats: []
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
          supportedProjections: []
        },
        outputFormats: []
      },
      href: ''
    }
  ],
  variables: [
    {
      name: 'mock_variable',
      href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
  ]
}

const derivedHarmonyState: DerivedHarmonyState = {
  capabilities: {
    concatenate: {
      disabled: true,
      supported: false
    },
    outputFormats: {
      disabled: true,
      outputFormatAvailability: {},
      supported: [],
      value: ''
    },
    reproject: {
      disabled: true,
      outputProjectionAvailability: {},
      supported: [],
      value: ''
    },
    spatialSubset: {
      disabled: false,
      shapeDisabled: false,
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
      name: 'mock_variable',
      href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
  ]
}

describe('when buildAccessMethods is called', () => {
  test('calls buildDownload access method', () => {
    const buildDownloadMock = vi.spyOn(buildDownload, 'buildDownload')

    const collectionMetadata = {
      granules: {
        items: [{
          online_access_flag: true
        }]
      }
    }
    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch, null)

    expect(buildDownloadMock).toHaveBeenCalledTimes(1)

    expect(buildDownloadMock).toHaveBeenCalledWith({ items: [{ online_access_flag: true }] }, false)
  })

  test('no access method is added if a non-existent service item is in the collection metadata and there is no capabilities document', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            type: 'unknown',
            url: {
              urlValue: 'https://example.com'
            }
          }
        ]
      }
    }

    const isOpenSearch = false

    const accessMethods = buildAccessMethods(
      collectionMetadata,
      isOpenSearch,
      null
    )

    expect(accessMethods).toEqual({})
  })

  test('no harmony access method is added if harmony capabilities document contains services: [] ', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            type: 'unknown',
            url: {
              urlValue: 'https://example.com'
            }
          }
        ]
      }
    }

    const noServicesHarmonyCapabilitiesDocument = {
      ...harmonyCapabilitiesDocument,
      services: []
    }
    const isOpenSearch = false

    const accessMethods = buildAccessMethods(
      collectionMetadata,
      isOpenSearch,
      noServicesHarmonyCapabilitiesDocument
    )

    expect(accessMethods).toEqual({})
  })

  test('calls buildHarmony access method', () => {
    const buildHarmonyMock = vi.spyOn(buildHarmony, 'buildHarmony')

    const collectionMetadata = {}

    const isOpenSearch = false

    buildAccessMethods(collectionMetadata, isOpenSearch, harmonyCapabilitiesDocument)

    expect(buildHarmonyMock).toHaveBeenCalledTimes(1)

    expect(buildHarmonyMock).toHaveBeenNthCalledWith(
      1,
      harmonyCapabilitiesDocument,
      {}
    )
  })

  describe('calls complex compilation of mutliple different access methods', () => {
    test('calls all access methods correctly', () => {
      const buildHarmonyMock = vi.spyOn(buildHarmony, 'buildHarmony')

      const collectionMetadata = {
        services: {
          items: []
        },
        variables: {
          count: 3,
          items: [
            {
              conceptId: 'V100000-EDSC',
              definition: 'Alpha channel value',
              longName: 'Alpha channel ',
              name: 'alpha_var',
              nativeId: 'mmt_variable_3972',
              scienceKeywords: null
            },
            {
              conceptId: 'V100001-EDSC',
              definition: 'Blue channel value',
              longName: 'Blue channel',
              name: 'blue_var',
              nativeId: 'mmt_variable_3971',
              scienceKeywords: null
            },
            {
              conceptId: 'V100002-EDSC',
              definition: 'Green channel value',
              longName: 'Green channel',
              name: 'green_var',
              nativeId: 'mmt_variable_3970',
              scienceKeywords: null
            }
          ]
        }
      }

      const isOpenSearch = false

      const accessMethods = buildAccessMethods(
        collectionMetadata,
        isOpenSearch,
        harmonyCapabilitiesDocument
      )

      expect(buildHarmonyMock).toHaveBeenCalledTimes(1)

      expect(buildHarmonyMock).toHaveBeenNthCalledWith(
        1,
        harmonyCapabilitiesDocument,
        {}
      )

      expect(accessMethods).toEqual(
        {
          harmony: {
            outputFormatAvailability: {},
            enableConcatenateDownload: false,
            enableSpatialSubsetting: false,
            enableTemporalSubsetting: false,
            harmonyCapabilitiesDocument,
            derivedHarmonyState,
            harmonyUserSelections: {},
            hierarchyMappings: [
              {
                id: 'V100000-EDSC'
              }
            ],
            id: 'C100000-EDSC',
            isConcatenationDisabled: true,
            isSpatialSubsettingDisabled: false,
            isTemporalSubsettingDisabled: false,
            isValid: true,
            isVariableSubsettingDisabled: false,
            keywordMappings: [],
            outputProjectionAvailability: {},
            selectedOutputFormat: undefined,
            selectedOutputProjection: undefined,
            selectedVariables: [],
            shortName: 'MOCK_SHORT_NAME',
            supportedOutputFormats: [],
            supportedOutputProjections: [],
            supportsConcatenation: false,
            supportsShapefileSubsetting: true,
            supportsBoundingBoxSubsetting: true,
            supportsSpatialSubsetting: true,
            supportsTemporalSubsetting: true,
            supportsVariableSubsetting: true,
            type: 'Harmony',
            url: 'https://harmony.earthdata.nasa.gov',
            variables: {
              'V100000-EDSC': {
                href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
                longName: '',
                name: 'mock_variable',
                scienceKeywords: [],
                units: ''
              }
            }
          }
        }
      )
    })
  })
})
