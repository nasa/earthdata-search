// import nock from 'nock'
import CwicRequest from '../cwic'
import { singleCwicGranuleResponse, multipleCwicGranulesResponse } from './mocks'


beforeEach(() => {
  jest.clearAllMocks()
})

describe('CwicRequest#transformRequest', () => {
  describe('when logged out', () => {
    test('returns a basic example result correctly transformed', () => {
      const cwicRequest = new CwicRequest()

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      expect(transformedData).toEqual('echo_collection_id=TEST_COLLECTION_ID')
    })

    test('returns only permitted keys correctly transformed', () => {
      const cwicRequest = new CwicRequest()

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID',
        nonPermittedKey: 'NOPE'
      }, {})

      expect(transformedData).toEqual('echo_collection_id=TEST_COLLECTION_ID')
    })
  })

  describe('when logged in', () => {
    test('returns a basic example result correctly transformed', () => {
      const cwicRequest = new CwicRequest('authToken')

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })

    test('returns only permitted keys correctly transformed', () => {
      const cwicRequest = new CwicRequest('authToken')

      const transformedData = cwicRequest.transformRequest({
        echoCollectionId: 'TEST_COLLECTION_ID',
        nonPermittedKey: 'NOPE'
      }, {})

      expect(transformedData).toEqual('{"params":{"echo_collection_id":"TEST_COLLECTION_ID"}}')
    })
  })
})

describe('CwicRequest#transformResponse', () => {
  test('formats single granule results correctly', () => {
    const cwicRequest = new CwicRequest()

    const transformedResponse = cwicRequest.transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'hits']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(1)
  })

  test('appends additional keys to each granule necessary to match CMR', () => {
    const cwicRequest = new CwicRequest()

    const transformedResponse = cwicRequest.transformResponse(singleCwicGranuleResponse)

    const { feed } = transformedResponse
    const { entry } = feed

    const granuleKeys = Object.keys(entry[0])
    expect(granuleKeys).toEqual(expect.arrayContaining(['browse_flag', 'thumbnail']))
  })

  test('formats multi-granule results correctly', () => {
    const cwicRequest = new CwicRequest()

    const transformedResponse = cwicRequest.transformResponse(multipleCwicGranulesResponse)

    const { feed } = transformedResponse
    expect(Object.keys(feed)).toEqual(expect.arrayContaining(['entry', 'hits']))

    const { entry } = feed
    expect(entry).toBeInstanceOf(Array)
    expect(entry.length).toEqual(2)
  })
})

describe('CwicRequest#search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // TODO: Test that when we call our search method that the transformations actually get called
  // test('all transformations are called', async () => {
  //   nock('/localhost/')
  //     .post(/cwic/)
  //     .reply(200, {
  //       feed: {
  //         updated: '2019-03-27T20:21:14.705Z',
  //         entry: [{
  //           mockCollectionData: 'goes here'
  //         }]
  //       }
  //     })

  //   const cwicRequest = new CwicRequest()

  //   const transformRequestMock = jest.spyOn(cwicRequest, 'transformRequest')
  //     .mockImplementation(() => jest.fn(() => '{}'))

  //   const expectedResponse = {
  //     feed: {
  //       entry: [],
  //       hits: 0
  //     }
  //   }
  //   const transformResponseMock = jest.spyOn(cwicRequest, 'transformResponse')
  //     .mockImplementation(() => jest.fn(() => expectedResponse))

  //   cwicRequest.search({})

  //   expect(transformRequestMock).toHaveBeenCalledTimes(1)
  //   expect(transformResponseMock).toHaveBeenCalledTimes(1)
  // })
})
