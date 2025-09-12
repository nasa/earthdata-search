import nock from 'nock'

import OpenSearchGranuleRequest from '../openSearchGranuleRequest'
import {
  multipleCwicGranulesResponse,
  singleCwicGranuleResponse,
  singleCwicGranuleResponseWithImage,
  singleCwicGranuleResponseWithImageStringLink
} from './mocks'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('OpenSearchGranuleRequest#transformRequest', () => {
  describe('when logged out', () => {
    test('returns a basic example result correctly transformed', () => {
      const openSearchGranulesRequest = new OpenSearchGranuleRequest()

      const transformedData = openSearchGranulesRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      const parsedData = JSON.parse(transformedData)
      expect(parsedData).toEqual(expect.objectContaining({ params: { echoCollectionId: 'TEST_COLLECTION_ID' } }))
    })
  })

  describe('when logged in', () => {
    test('returns a basic example result correctly transformed', () => {
      const openSearchGranulesRequest = new OpenSearchGranuleRequest('authToken')
      openSearchGranulesRequest.startTime = 1576855756

      const transformedData = openSearchGranulesRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      const parsedData = JSON.parse(transformedData)
      expect(parsedData).toEqual(expect.objectContaining({ params: { echoCollectionId: 'TEST_COLLECTION_ID' } }))
    })
  })
})

describe('OpenSearchGranuleRequest#transformResponse', () => {
  test('formats single granule results correctly', () => {
    const openSearchGranulesRequest = new OpenSearchGranuleRequest()

    const transformedResponse = openSearchGranulesRequest
      .transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'count']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(1)
  })

  test('appends additional keys to each granule necessary to match CMR', () => {
    const openSearchGranulesRequest = new OpenSearchGranuleRequest()

    const transformedResponse = openSearchGranulesRequest
      .transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    const { entry } = feed

    const granuleKeys = Object.keys(entry[0])
    expect(granuleKeys).toEqual(expect.arrayContaining(['browseFlag', 'thumbnail']))
  })

  test('formats multi-granule results correctly', () => {
    const openSearchGranulesRequest = new OpenSearchGranuleRequest()

    const transformedResponse = openSearchGranulesRequest
      .transformResponse(multipleCwicGranulesResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'count']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(2)
  })

  test('formats multi-granule results correctly when parseXml gives empty granules', () => {
    const mockParse = jest.fn().mockImplementation(() => ({
      feed: {
        entry: [{}, {}, {}, '']
      }
    }))

    const openSearchGranulesRequest = new OpenSearchGranuleRequest()
    openSearchGranulesRequest.xmlParser = {
      parse: mockParse
    }

    const transformedResponse = openSearchGranulesRequest
      .transformResponse(multipleCwicGranulesResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'count']))

    const { entry } = feed
    expect(mockParse).toHaveBeenCalledTimes(1)
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(3)
  })

  describe('sets the full browse image correctly', () => {
    test('when the granule has no link', () => {
      const openSearchGranulesRequest = new OpenSearchGranuleRequest()

      const transformedResponse = openSearchGranulesRequest
        .transformResponse(singleCwicGranuleResponse)

      const { feed } = transformedResponse
      const { entry } = feed
      expect(entry[0].browse_url)
        .toEqual(undefined)
    })

    test('when the granule has a link', () => {
      const openSearchGranulesRequest = new OpenSearchGranuleRequest()

      const transformedResponse = openSearchGranulesRequest
        .transformResponse(singleCwicGranuleResponseWithImage)

      const { feed } = transformedResponse
      const { entry } = feed
      expect(entry[0].browseUrl)
        .toEqual('https://uops.nrsc.gov.in//imgarchive/IRS1C/LISS/1996/NOV/14/083042LG.319.jpeg')
    })

    test('when the granule has a string link', () => {
      const openSearchGranulesRequest = new OpenSearchGranuleRequest()

      const transformedResponse = openSearchGranulesRequest
        .transformResponse(singleCwicGranuleResponseWithImageStringLink)

      const { feed } = transformedResponse
      const { entry } = feed
      expect(entry[0].browseUrl)
        .toEqual('https://uops.nrsc.gov.in//imgarchive/IRS1C/LISS/1996/NOV/14/083042LG.319.jpeg')
    })
  })
})

describe('OpenSearchGranuleRequest#search', () => {
  test('all transformations are called', async () => {
    nock(/localhost/)
      .post(/opensearch/)
      .reply(200, singleCwicGranuleResponse)

    const openSearchGranulesRequest = new OpenSearchGranuleRequest()

    openSearchGranulesRequest.transformRequest = jest.fn(() => {})

    const expectedResponse = {
      feed: {
        entry: [],
        count: 0
      }
    }
    openSearchGranulesRequest.transformResponse = jest.fn(() => expectedResponse)

    await openSearchGranulesRequest.search({})

    expect(openSearchGranulesRequest.transformRequest).toHaveBeenCalledTimes(1)
    expect(openSearchGranulesRequest.transformResponse).toHaveBeenCalledTimes(1)
  })
})
