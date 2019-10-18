import * as applicationConfig from '../config'
import {
  getUmmCollectionVersionHeader,
  getUmmGranuleVersionHeader,
  getUmmServiceVersionHeader,
  getUmmVariableVersionHeader
} from '../ummVersionHeader'

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(applicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    ummCollectionVersion: '5',
    ummGranuleVersion: '6',
    ummServiceVersion: '7',
    ummVariableVersion: '8'
  }))
})

describe('getUmmCollectionVersionHeader', () => {
  test('returns the correct version from the config', () => {
    const name = getUmmCollectionVersionHeader()
    expect(name).toEqual('application/vnd.nasa.cmr.umm_results+json; version=5')
  })
})

describe('getUmmGranuleVersionHeader', () => {
  test('returns the correct version from the config', () => {
    const name = getUmmGranuleVersionHeader()
    expect(name).toEqual('application/vnd.nasa.cmr.umm_results+json; version=6')
  })
})

describe('getUmmServiceVersionHeader', () => {
  test('returns the correct version from the config', () => {
    const name = getUmmServiceVersionHeader()
    expect(name).toEqual('application/vnd.nasa.cmr.umm_results+json; version=7')
  })
})

describe('getUmmVariableVersionHeader', () => {
  test('returns the correct version from the config', () => {
    const name = getUmmVariableVersionHeader()
    expect(name).toEqual('application/vnd.nasa.cmr.umm_results+json; version=8')
  })
})
