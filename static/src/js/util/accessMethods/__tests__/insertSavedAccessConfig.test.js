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
      esi0: {
        form: '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"><help>Helpful text</help></input></ui></form>',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          name: 'mock form'
        },
        type: 'ESI',
        url: 'https://example.com'
      }
    }
    const savedAccessConfig = {}

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods
    })
  })

  test('returns the original methods if no the echoform cannot be parsed', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const methods = {
      esi0: {
        form: '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"><help>Helpful text</help></input></ui></form>',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          name: 'mock form'
        },
        type: 'ESI',
        url: 'https://example.com'
      }
    }
    const savedAccessConfig = {
      ...methods.esi0,
      model: 'mock',
      rawModel: 'mock'
    }

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods,
      selectedAccessMethod: 'esi0'
    })

    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith('There was a problem parsing the savedAccessConfig values, using the default form instead.')
  })

  test('inserts a saved ESI access config', () => {
    const methods = {
      download: {
        isValid: true,
        type: 'download'
      },
      esi0: {
        form: '<form><model><instance><prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options></instance></model><ui><input id="boolinput" label="Bool input" ref="prov:boolreference" type="xs:boolean"><help>Helpful text</help></input></ui></form>',
        formDigest: '75f9480053e9ba083665951820d17ae5c2139d92',
        optionDefinition: {
          conceptId: 'OO10000-EDSC',
          name: 'mock form'
        },
        type: 'ESI',
        url: 'https://example.com'
      }
    }
    const savedAccessConfig = {
      ...methods.esi0,
      model: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options>',
      rawModel: '<prov:options xmlns:prov="http://www.example.com/orderoptions"><prov:boolreference>true</prov:boolreference></prov:options>'
    }

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods: {
        ...methods,
        esi0: savedAccessConfig
      },
      selectedAccessMethod: 'esi0'
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
