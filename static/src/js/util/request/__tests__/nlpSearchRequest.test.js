import axios from 'axios'
import NlpSearchRequest from '../nlpSearchRequest'
import { getEarthdataConfig } from '../../../../../../sharedUtils/config'

jest.mock('axios')
jest.mock('../../../../../../sharedUtils/config')

const mockConfig = {
  cmrHost: 'https://cmr.sit.earthdata.nasa.gov'
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
  getEarthdataConfig.mockReturnValue(mockConfig)
})

describe('NlpSearchRequest#constructor', () => {
  test('sets searchPath correctly', () => {
    const request = new NlpSearchRequest('test-auth-token', 'sit')

    expect(request.searchPath).toBe('search/nlp/query.json')
  })
})

describe('NlpSearchRequest#filterData', () => {
  test('returns picked data when data is provided', () => {
    const request = new NlpSearchRequest('', 'sit')
    const testData = {
      q: 'test',
      pageNum: 1,
      invalidKey: 'invalid'
    }

    const result = request.filterData(testData)

    expect(result).toEqual({
      q: 'test',
      pageNum: 1
    })
  })

  test('returns data as-is when data is null', () => {
    const request = new NlpSearchRequest('', 'sit')

    const result = request.filterData(null)

    expect(result).toBeNull()
  })

  test('returns data as-is when data is undefined', () => {
    const request = new NlpSearchRequest('', 'sit')

    const result = request.filterData(undefined)

    expect(result).toBeUndefined()
  })
})

describe('NlpSearchRequest#get', () => {
  test('calls axios with correct options', async () => {
    const request = new NlpSearchRequest('test-token', 'sit')
    const startTimerSpy = jest.spyOn(request, 'startTimer').mockImplementation()
    const setFullUrlSpy = jest.spyOn(request, 'setFullUrl').mockImplementation()
    const mockCancelToken = { token: 'mock-cancel-token' }
    request.cancelToken = mockCancelToken
    const mockResponse = { data: 'test' }
    axios.mockResolvedValue(mockResponse)

    const url = 'test/path'
    const params = { q: 'test' }

    const result = await request.get(url, params)

    expect(startTimerSpy).toHaveBeenCalledTimes(1)
    expect(setFullUrlSpy).toHaveBeenCalledWith(url)
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      baseURL: mockConfig.cmrHost,
      url,
      params,
      cancelToken: mockCancelToken.token
    })

    expect(result).toBe(mockResponse)
  })
})

describe('NlpSearchRequest#search', () => {
  test('calls get with searchPath and params', () => {
    const request = new NlpSearchRequest('', 'sit')
    const getSpy = jest.spyOn(request, 'get').mockImplementation()
    const searchParams = {
      q: 'test',
      pageNum: 1
    }

    request.search(searchParams)

    expect(getSpy).toHaveBeenCalledWith('search/nlp/query.json', searchParams)
  })
})

describe('NlpSearchRequest#nonIndexedKeys', () => {
  test('returns an empty array', () => {
    const request = new NlpSearchRequest('', 'sit')

    expect(request.nonIndexedKeys()).toEqual([])
  })
})

describe('NlpSearchRequest#permittedCmrKeys', () => {
  test('returns the correct array of permitted keys', () => {
    const request = new NlpSearchRequest('', 'sit')

    expect(request.permittedCmrKeys()).toEqual(['q', 'pageNum', 'pageSize'])
  })
})
