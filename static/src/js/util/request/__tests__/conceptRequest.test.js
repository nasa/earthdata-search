import ConceptRequest from '../conceptRequest'
import Request from '../request'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ConceptRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const token = '123'
    const request = new ConceptRequest(token)

    expect(request.authenticated).toBeTruthy()
    expect(request.authToken).toEqual(token)
    expect(request.baseUrl).toEqual('http://localhost:3000')
    expect(request.searchPath).toEqual('concepts')
  })

  test('sets the default values when unauthenticated', () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://cmr.earthdata.nasa.gov' }))

    const request = new ConceptRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.baseUrl).toEqual('https://cmr.earthdata.nasa.gov')
    expect(request.searchPath).toEqual('search/concepts')
  })
})

describe('ConceptRequest#search', () => {
  test('calls Request#get', () => {
    const request = new ConceptRequest()

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    const conceptId = 'collectionId'
    const format = 'json'
    const params = {
      pretty: true
    }
    request.search(conceptId, format, params)

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('search/concepts/collectionId.json', { pretty: true })
  })
})
