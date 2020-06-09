import * as applicationConfig from '../config'
import {
  getUmmGranuleVersionHeader,
  getUmmServiceVersionHeader
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
