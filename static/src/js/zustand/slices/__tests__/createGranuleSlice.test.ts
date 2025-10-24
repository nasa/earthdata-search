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
import routerHelper from '../../../router/router'

jest.mock('../../../actions', () => ({
  changeUrl: jest.fn(),
  handleError: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createGranuleSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { granule } = zustandState

    expect(granule).toEqual({
      granuleId: null,
      granuleMetadata: {},
      getGranuleMetadata: expect.any(Function),
      setGranuleId: expect.any(Function)
    })
  })

  describe('setGranuleId', () => {
    describe('when a granuleId is provided', () => {
      test('sets the state and calls getGranuleMetadata', () => {
        useEdscStore.setState((state) => {
          state.granule.getGranuleMetadata = jest.fn()
        })

        const granuleId = 'test-granule-id'
        const zustandState = useEdscStore.getState()
        const { granule } = zustandState
        const { setGranuleId } = granule

        setGranuleId(granuleId)

        const { granule: updatedGranule } = useEdscStore.getState()

        expect(updatedGranule.granuleId).toEqual(granuleId)

        expect(updatedGranule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(updatedGranule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when no granuleId is provided', () => {
      test('sets the state and does not call getGranuleMetadata', () => {
        useEdscStore.setState((state) => {
          state.granule.getGranuleMetadata = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { granule } = zustandState
        const { setGranuleId } = granule

        setGranuleId(null)

        const { granule: updatedGranule } = useEdscStore.getState()

        expect(updatedGranule.granuleId).toEqual(null)

        expect(updatedGranule.getGranuleMetadata).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('getGranuleMetadata', () => {
    beforeEach(() => {
      jest.spyOn(getClientId, 'getClientId').mockImplementationOnce(() => ({ client: 'eed-edsc-test-serverless-client' }))

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      useEdscStore.setState((state) => {
        state.errors.handleError = jest.fn()
      })
    })

    describe('when metadata has already been retrieved from graphql', () => {
      test('should take no action', async () => {
        useEdscStore.setState((state) => {
          state.granule.granuleId = 'granuleId'
          state.granule.granuleMetadata.granuleId = {
            id: 'granuleId',
            hasAllMetadata: true
          }
        })

        mockGetState.mockReturnValue({
          authToken: ''
        })

        const { granule, errors } = useEdscStore.getState()
        const { getGranuleMetadata } = granule

        await getGranuleMetadata()

        expect(actions.changeUrl).toHaveBeenCalledTimes(0)
        expect(errors.handleError).toHaveBeenCalledTimes(0)
      })
    })

    describe('when no metadata exists in the store for the collection from graphql', () => {
      describe('when graphql returns metadata for the requested collection', () => {
        test('should update the granule and fetch metadata from graphql', async () => {
          nock(/graph/)
            .post(/api/)
            .reply(200, {
              data: {
                granule: {
                  conceptId: 'granuleId'
                }
              }
            })

          useEdscStore.setState((state) => {
            state.granule.granuleId = 'granuleId'
          })

          mockGetState.mockReturnValue({
            authToken: ''
          })

          const { granule, errors } = useEdscStore.getState()
          const { getGranuleMetadata } = granule

          await getGranuleMetadata()

          const { granule: updatedGranule } = useEdscStore.getState()
          expect(updatedGranule.granuleMetadata).toEqual({
            granuleId: {
              collectionConceptId: undefined,
              conceptId: 'granuleId',
              dataCenter: undefined,
              dataGranule: undefined,
              dayNightFlag: undefined,
              granuleSize: undefined,
              granuleUr: undefined,
              hasAllMetadata: true,
              id: 'granuleId',
              measuredParameters: undefined,
              metadataUrls: {
                atom: {
                  href: 'https://cmr.example.com/search/concepts/granuleId.atom',
                  title: 'ATOM'
                },
                echo10: {
                  href: 'https://cmr.example.com/search/concepts/granuleId.echo10',
                  title: 'ECHO 10'
                },
                iso19115: {
                  href: 'https://cmr.example.com/search/concepts/granuleId.iso19115',
                  title: 'ISO 19115'
                },
                native: {
                  href: 'https://cmr.example.com/search/concepts/granuleId',
                  title: 'Native'
                },
                umm_json: {
                  href: 'https://cmr.example.com/search/concepts/granuleId.umm_json',
                  title: 'UMM-G'
                }
              },
              onlineAccessFlag: undefined,
              originalFormat: undefined,
              providerDates: undefined,
              relatedUrls: undefined,
              spatialExtent: undefined,
              temporalExtent: undefined,
              timeEnd: undefined,
              timeStart: undefined,
              title: undefined
            }
          })

          expect(actions.changeUrl).toHaveBeenCalledTimes(0)
          expect(errors.handleError).toHaveBeenCalledTimes(0)
        })

        describe('when the requested granule is opensearch', () => {
          test('take no action', async () => {
            useEdscStore.setState((state) => {
              state.collection.collectionId = 'collectionId'
              state.collection.collectionMetadata.collectionId = {
                conceptId: 'collectionId',
                isOpenSearch: true
              }

              state.granule.granuleId = 'granuleId'
            })

            mockGetState.mockReturnValue({
              authToken: ''
            })

            const { granule, errors } = useEdscStore.getState()
            const { getGranuleMetadata } = granule

            await getGranuleMetadata()

            expect(actions.changeUrl).toHaveBeenCalledTimes(0)
            expect(errors.handleError).toHaveBeenCalledTimes(0)
          })
        })
      })

      describe('when graphql returns no metadata for the requested collection', () => {
        test('should clear the granule', async () => {
          nock(/graph/)
            .post(/api/)
            .reply(200, {
              data: {
                granule: null
              }
            })

          useEdscStore.setState((state) => {
            state.granule.granuleId = 'granuleId'
          })

          routerHelper.router = {
            navigate: jest.fn(),
            state: {
              location: {
                search: '?some=testparams',
                pathname: '/search/granules'
              }
            },
            subscribe: jest.fn()
          }

          mockGetState.mockReturnValue({
            authToken: ''
          })

          const { granule, errors } = useEdscStore.getState()
          const { getGranuleMetadata } = granule

          await getGranuleMetadata()

          const { granule: updatedGranule } = useEdscStore.getState()
          expect(updatedGranule.granuleId).toEqual(null)

          expect(errors.handleError).toHaveBeenCalledTimes(0)

          expect(actions.changeUrl).toHaveBeenCalledTimes(1)
          expect(actions.changeUrl).toHaveBeenCalledWith({
            pathname: '/search',
            search: '?some=testparams'
          })
        })
      })
    })

    describe('when graphql throws an http error', () => {
      test('does not call updateGranuleMetadata', async () => {
        nock(/graph/)
          .post(/api/)
          .reply(500)

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        useEdscStore.setState((state) => {
          state.granule.granuleId = 'granuleId'
        })

        mockGetState.mockReturnValue({
          authToken: ''
        })

        const { granule } = useEdscStore.getState()
        const { getGranuleMetadata } = granule

        await getGranuleMetadata()

        const { granule: updatedGranule, errors } = useEdscStore.getState()
        expect(updatedGranule.granuleId).toEqual(null)

        expect(actions.changeUrl).toHaveBeenCalledTimes(0)

        expect(errors.handleError).toHaveBeenCalledTimes(1)
        expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
          action: 'getGranuleMetadata',
          error: expect.any(Error),
          resource: 'granule',
          showAlertButton: true,
          title: 'Something went wrong fetching granule metadata'
        }))
      })
    })
  })
})
