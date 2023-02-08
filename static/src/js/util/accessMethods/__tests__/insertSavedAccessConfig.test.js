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
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

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

    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith('Found savedAccessConfig of type ESI')
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
      harmony0: {
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
        keywordMappings: [],
        longName: 'Mock Service Name',
        name: 'mock-name',
        supportedOutputFormats: [
          'GEOTIFF',
          'PNG',
          'TIFF',
          'NETCDF-4'
        ],
        supportedOutputProjections: [],
        supportsBoundingBoxSubsetting: true,
        supportsShapefileSubsetting: false,
        supportsTemporalSubsetting: false,
        supportsVariableSubsetting: true,
        type: 'Harmony',
        url: 'https://example.com',
        variables: {
          'V100000-EDSC': {
            conceptId: 'V100000-EDSC',
            definition: 'Alpha channel value',
            longName: 'Alpha channel ',
            name: 'alpha_var',
            nativeId: 'mmt_variable_3972',
            scienceKeywords: null
          },
          'V100001-EDSC': {
            conceptId: 'V100001-EDSC',
            definition: 'Blue channel value',
            longName: 'Blue channel',
            name: 'blue_var',
            nativeId: 'mmt_variable_3971',
            scienceKeywords: null
          },
          'V100002-EDSC': {
            conceptId: 'V100002-EDSC',
            definition: 'Green channel value',
            longName: 'Green channel',
            name: 'green_var',
            nativeId: 'mmt_variable_3970',
            scienceKeywords: null
          },
          'V100003-EDSC': {
            conceptId: 'V100003-EDSC',
            definition: 'Red channel value',
            longName: 'Red Channel',
            name: 'red_var',
            nativeId: 'mmt_variable_3969',
            scienceKeywords: null
          }
        }
      }
    }
    const savedAccessConfig = {
      ...methods.harmony0,
      selectedVariables: ['V1233801717-EEDTEST'],
      selectedOutputFormat: 'image/png'
    }

    const result = insertSavedAccessConfig(methods, savedAccessConfig)

    expect(result).toEqual({
      methods: {
        ...methods,
        harmony0: savedAccessConfig
      },
      selectedAccessMethod: 'harmony0'
    })
  })
})
