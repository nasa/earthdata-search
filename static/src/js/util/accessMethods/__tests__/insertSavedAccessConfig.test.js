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
        outputFormatAvailability: {
          GEOTIFF: true,
          PNG: true,
          TIFF: true,
          'NETCDF-4': true
        },
        enableConcatenateDownload: false,
        enableSpatialSubsetting: false,
        enableTemporalSubsetting: true,
        hierarchyMappings: [
          {
            id: 'V100000-EDSC'
          },
          {
            id: 'V100001-EDSC'
          },
          {
            id: 'V100002-EDSC'
          },
          {
            id: 'V100003-EDSC'
          }
        ],
        id: 'S100000-EDSC',
        isValid: true,
        isOutputFormatsDisabled: false,
        isSpatialSubsettingDisabled: false,
        isTemporalSubsettingDisabled: false,
        isVariableSubsettingDisabled: false,
        isConcatenationDisabled: false,
        keywordMappings: [],
        shortName: 'Mock Harmony Method',
        selectedOutputFormat: undefined,
        selectedVariables: [],
        supportedOutputFormats: [
          {
            name: 'GEOTIFF',
            mimeType: 'GEOTIFF'
          },
          {
            name: 'PNG',
            mimeType: 'PNG'
          },
          {
            name: 'TIFF',
            mimeType: 'TIFF'
          },
          {
            name: 'NETCDF-4',
            mimeType: 'NETCDF-4'
          }
        ],
        supportedOutputProjections: [],
        supportsBoundingBoxSubsetting: true,
        supportsConcatenation: false,
        supportsShapefileSubsetting: false,
        supportsTemporalSubsetting: false,
        supportsVariableSubsetting: true,
        type: 'Harmony',
        url: 'https://example.com',
        variables: {
          'V100000-EDSC': {
            name: 'alpha_var',
            href: 'https://cmr.earthdata.nasa.gov/search/concepts/V100000-EDSC',
            scienceKeywords: []
          }
        },
        harmonyUserSelections: {},
        derivedHarmonyState: {},
        harmonyCapabilitiesDocument: {
          conceptId: 'S100000-EDSC',
          shortName: 'Mock',
          summary: {
            subsetting: {},
            reprojection: {},
            concatenation: false,
            outputFormats: []
          },
          services: [],
          variables: []
        }
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
