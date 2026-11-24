import { insertSavedAccessConfig } from '../insertSavedAccessConfig'

describe('insertSavedAccessConfig', () => {
  test('inserts a saved download access config', () => {
    const methods = {
      download: {
        isValid: true,
        type: 'download'
      }
    }
    const savedAccessConfig = {
      isValid: true,
      type: 'download'
    }

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods: {
        download: {
          isValid: true,
          type: 'download'
        }
      },
      selectedAccessMethod: 'download'
    })
  })

  test('returns the original methods if no savedAccessConfig exists', () => {
    const methods = {
      harmony: {
        mbr: {
          neLat: 31.08850198924431,
          neLng: -94.19999999999999,
          swLat: 28.275300000000215,
          swLng: -99.50000000000001
        },
        url: 'https://harmony.earthdata.nasa.gov',
        type: 'Harmony',
        selectedOutputFormat: 'application/netcdf',
        supportsConcatenation: true,
        enableSpatialSubsetting: true,
        enableTemporalSubsetting: true,
        enableConcatenateDownload: true,
        supportsShapefileSubsetting: true,
        supportsBoundingBoxSubsetting: true
      }
    }
    const savedAccessConfig = {}

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods
    })
  })

  test('inserts a saved Harmony access config', () => {
    const methods = {
      download: {
        isValid: true,
        type: 'download'
      },
      harmony: {
        id: 'S100000-EDSC',
        isValid: true,
        shortName: 'harmony/gdal-argo Subsetter and Reformatter.',
        outputFormatAvailability: {
          TIFF: true,
          PNG: true,
          GIF: true
        },
        enableConcatenateDownload: false,
        enableSpatialSubsetting: false,
        enableTemporalSubsetting: false,
        isSpatialSubsettingDisabled: false,
        isTemporalSubsettingDisabled: false,
        isVariableSubsettingDisabled: false,
        isConcatenationDisabled: false,
        hierarchyMappings: [],
        keywordMappings: [],
        selectedOutputFormat: undefined,
        selectedVariables: [],
        supportsBoundingBoxSubsetting: true,
        supportsConcatenation: false,
        supportsShapefileSubsetting: true,
        supportsTemporalSubsetting: true,
        supportsVariableSubsetting: true,
        supportedOutputFormats: [
          {
            mimeType: 'TIFF',
            name: 'TIFF'
          },
          {
            mimeType: 'PNG',
            name: 'PNG'
          },
          {
            mimeType: 'GIF',
            name: 'GIF'
          }
        ],
        supportedOutputProjections: [
          {
            crs: 'EPSG:4326',
            name: 'Geographic'
          }
        ],
        type: 'Harmony',
        url: 'https://harmony.sit.earthdata.nasa.gov',
        variables: {
          'V100000-EDSC': {
            href: 'https://cmr.example.com/search/concepts/V100000-EDSC',
            longName: '',
            name: 'mock_variable',
            scienceKeywords: [],
            units: ''
          }
        },
        harmonyUserSelections: {},
        derivedHarmonyState: {},
        harmonyCapabilitiesDocument: {
          conceptId: 'C100000-EDSC',
          shortName: 'Mock',
          summary: {
            subsetting: {},
            reprojection: {
              supportedProjections: [
                {
                  name: 'Geographic',
                  crs: 'EPSG:4326'
                }
              ]
            },
            concatenation: false,
            outputFormats: []
          },
          services: [],
          variables: []
        },
        outputProjectionAvailability: { Geographic: true },
        selectedOutputProjection: undefined,
        supportsSpatialSubsetting: false
      }
    }
    const savedAccessConfig = {
      ...methods.harmony,
      selectedVariables: ['V1233801717-EEDTEST'],
      selectedOutputFormat: 'image/png'
    }

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods: {
        ...methods,
        harmony: savedAccessConfig
      },
      selectedAccessMethod: 'harmony'
    })
  })
})
