import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'

// @ts-expect-error This file does not have types
import * as getClientId from '../../../../../../sharedUtils/getClientId'
// @ts-expect-error This file does not have types
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import OpenSearchGranuleRequest from '../../../util/request/openSearchGranuleRequest'

jest.mock('../../../actions', () => ({
  handleError: jest.fn(),
  toggleSpatialPolygonWarning: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createGranulesSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { granules } = zustandState

    expect(granules).toEqual({
      granules: {
        collectionConceptId: null,
        count: null,
        isLoaded: false,
        isLoading: false,
        loadTime: 0,
        items: []
      },
      getGranules: expect.any(Function)
    })
  })

  describe('getGranules', () => {
    beforeEach(() => {
      jest.spyOn(getClientId, 'getClientId').mockImplementationOnce(() => ({ client: 'eed-edsc-test-serverless-client' }))

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))
    })

    test('calls the API to get granules', async () => {
      nock(/cmr/)
        .post(/granules/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
            title: 'ECHO granule metadata',
            entry: [{
              mockGranuleData: 'goes here'
            }]
          }
        }, {
          'cmr-hits': '1'
        })

      mockGetState.mockReturnValue({
        authToken: ''
      })

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'collectionId'
      })

      const { granules } = useEdscStore.getState()
      await granules.getGranules()

      const { granules: updatedGranules } = useEdscStore.getState()
      expect(updatedGranules.granules).toEqual({
        collectionConceptId: 'collectionId',
        count: 1,
        isLoaded: true,
        isLoading: false,
        items: [{
          isOpenSearch: false,
          mockGranuleData: 'goes here',
          spatial: null
        }],
        loadTime: expect.any(Number)
      })

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

      expect(actions.handleError).toHaveBeenCalledTimes(0)
    })

    test('calls lambda to get authenticated granules', async () => {
      nock(/localhost/)
        .post(/granules/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
            title: 'ECHO granule metadata',
            entry: [{
              mockGranuleData: 'goes here'
            }]
          }
        }, {
          'cmr-hits': '1',
          'jwt-token': 'token'
        })

      mockGetState.mockReturnValue({
        authToken: 'mock-token'
      })

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'collectionId'
      })

      const { granules } = useEdscStore.getState()
      await granules.getGranules()

      const { granules: updatedGranules } = useEdscStore.getState()
      expect(updatedGranules.granules).toEqual({
        collectionConceptId: 'collectionId',
        count: 1,
        isLoaded: true,
        isLoading: false,
        items: [{
          isOpenSearch: false,
          mockGranuleData: 'goes here',
          spatial: null
        }],
        loadTime: expect.any(Number)
      })

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

      expect(actions.handleError).toHaveBeenCalledTimes(0)
    })

    test('substitutes MBR for polygon in opensearch granule searches', async () => {
      const cwicRequestMock = jest.spyOn(OpenSearchGranuleRequest.prototype, 'search')

      nock(/localhost/)
        .post(/opensearch\/granules/)
        .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title type="text">CWIC Granule</title><id>12345</id><updated>2020-06-09T23:59:59Z</updated></entry></feed>')

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'collectionId'
        state.collection.collectionMetadata.collectionId = {
          conceptId: 'collectionId',
          links: [{
            length: '0.0KB',
            rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
            hreflang: 'en-US',
            href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
          }]
        }

        state.query.collection.spatial = {
          polygon: ['-77,38,-77,38,-76,38,-77,38']
        }
      })

      mockGetState.mockReturnValue({
        authToken: 'mock-token'
      })

      const { granules } = useEdscStore.getState()
      await granules.getGranules()

      const { granules: updatedGranules } = useEdscStore.getState()
      expect(updatedGranules.granules).toEqual({
        count: 1,
        collectionConceptId: 'collectionId',
        isLoaded: true,
        isLoading: false,
        items: [{
          browseFlag: false,
          formattedTemporal: [
            '2020-06-09 23:59:59',
            null
          ],
          id: '12345',
          collectionConceptId: 'collectionId',
          isOpenSearch: true,
          spatial: null,
          timeStart: '2020-06-09T23:59:59Z',
          title: 'CWIC Granule',
          updated: '2020-06-09T23:59:59Z'
        }],
        loadTime: expect.any(Number)
      })

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(2)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(1, false)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(2, true)

      expect(actions.handleError).toHaveBeenCalledTimes(0)

      expect(cwicRequestMock).toHaveBeenCalledTimes(1)
      expect(cwicRequestMock.mock.calls[0][0].boundingBox).toEqual('-77,37.99999999999998,-76,38.00105844675541')
    })

    test('does not update the store on error', async () => {
      nock(/cmr/)
        .post(/granules/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'collectionId'
        state.collection.collectionMetadata.collectionId = {
          conceptId: 'collectionId'
        }
      })

      mockGetState.mockReturnValue({
        authToken: ''
      })

      const { granules } = useEdscStore.getState()
      await granules.getGranules()

      expect(actions.handleError).toHaveBeenCalledTimes(1)
      expect(actions.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'getGranules',
        error: expect.any(Error),
        resource: 'granules'
      }))
    })
  })
})
