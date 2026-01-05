import useEdscStore from '../../../zustand/useEdscStore'
import { initialState as initialQueryState } from '../../../zustand/slices/createQuerySlice'

// @ts-expect-error This file does not have types
import { initialGranuleQuery } from '../collectionsEncoders'

// @ts-expect-error This file does not have types
import getApolloClient from '../../../providers/getApolloClient'

import { changePath } from '../changePath'
import { updateStore } from '../updateStore'

jest.mock('../updateStore', () => ({
  __esModule: true,
  updateStore: jest.fn()
}))

jest.mock('../../../providers/getApolloClient', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue({
      data: {
        project: {
          obfuscatedId: '1',
          name: null,
          path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        }
      }
    })
  })
}))

describe('changePath', () => {
  test('retrieves path from database if there is a projectId', async () => {
    const mockQuery = jest.fn().mockResolvedValue({
      data: {
        project: {
          name: 'Test Project',
          obfuscatedId: '12345',
          path: '/search/granules?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        }
      }
    })

    getApolloClient.mockReturnValue({
      query: mockQuery
    })

    useEdscStore.setState((state) => {
      /* eslint-disable no-param-reassign */
      state.collections.getCollections = jest.fn()

      state.project.collections.allIds = ['C00001-EDSC']
      state.project.getProjectCollections = jest.fn()
      state.project.getProjectGranules = jest.fn()

      state.timeline.getTimeline = jest.fn()
      /* eslint-enable no-param-reassign */
    })

    const newPath = '/search?projectId=12345'

    await changePath(newPath)

    expect(updateStore).toHaveBeenCalledTimes(1)
    expect(updateStore).toHaveBeenCalledWith(
      expect.objectContaining({
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false
        },
        deprecatedUrlParams: [],
        focusedCollection: 'C00001-EDSC',
        project: {
          collections: {
            allIds: ['C00001-EDSC'],
            byId: {
              'C00001-EDSC': {
                granules: {},
                isVisible: true,
                selectedAccessMethod: undefined
              }
            }
          }
        },
        query: {
          collection: {
            byId: {
              'C00001-EDSC': {
                granules: initialGranuleQuery
              }
            },
            hasGranulesOrCwic: true,
            overrideTemporal: {},
            pageNum: 1,
            spatial: initialQueryState.collection.spatial,
            temporal: {}
          }
        },
        shapefile: {
          shapefileId: ''
        }
      })
    )

    const zustandState = useEdscStore.getState()
    const {
      collections,
      project,
      savedProject,
      timeline
    } = zustandState

    expect(savedProject.project).toEqual({
      id: '12345',
      name: 'Test Project',
      path: '/search/granules?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
    })

    expect(collections.getCollections).toHaveBeenCalledTimes(1)
    expect(collections.getCollections).toHaveBeenCalledWith()

    expect(project.getProjectCollections).toHaveBeenCalledTimes(1)
    expect(project.getProjectCollections).toHaveBeenCalledWith()

    expect(project.getProjectGranules).toHaveBeenCalledTimes(1)
    expect(project.getProjectGranules).toHaveBeenCalledWith()

    expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
    expect(timeline.getTimeline).toHaveBeenCalledWith()
  })

  test('updates the store if there is not a projectId', async () => {
    useEdscStore.setState((state) => {
      /* eslint-disable no-param-reassign */
      state.collections.getCollections = jest.fn()
      state.savedProject.setProject = jest.fn()
      state.timeline.getTimeline = jest.fn()
      /* eslint-enable no-param-reassign */
    })

    const newPath = '/search?p=C00001-EDSC'

    await changePath(newPath)

    expect(updateStore).toHaveBeenCalledTimes(1)
    expect(updateStore).toHaveBeenCalledWith(expect.objectContaining({
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false
      },
      focusedCollection: 'C00001-EDSC',
      query: {
        collection: {
          byId: {
            'C00001-EDSC': {
              granules: initialGranuleQuery
            }
          },
          hasGranulesOrCwic: true,
          overrideTemporal: {},
          pageNum: 1,
          spatial: initialQueryState.collection.spatial,
          temporal: {}
        }
      },
      shapefile: {
        shapefileId: ''
      }
    }), '/search')

    const zustandState = useEdscStore.getState()
    const {
      collections,
      savedProject,
      timeline
    } = zustandState

    expect(savedProject.setProject).toHaveBeenCalledTimes(0)

    expect(collections.getCollections).toHaveBeenCalledTimes(1)
    expect(collections.getCollections).toHaveBeenCalledWith()

    expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
    expect(timeline.getTimeline).toHaveBeenCalledWith()
  })

  describe('when a path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules/collection-details?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/search/granules/subscriptions?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getCollectionMetadata and getGranuleMetadata', async () => {
        const newPath = '/search/granules/granule-details?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })
  })

  describe('when a portal path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules/collection-details?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getCollectionMetadata action', async () => {
        const newPath = '/portal/fakeportal/search/granules/subscriptions?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getCollectionMetadata and getGranuleMetadata', async () => {
        const newPath = '/portal/fakeportal/search/granules/granule-details?p=C00001-EDSC'

        useEdscStore.setState((state) => {
          /* eslint-disable no-param-reassign */
          state.collection.getCollectionMetadata = jest.fn()
          state.collections.getCollections = jest.fn()
          state.granule.getGranuleMetadata = jest.fn()
          /* eslint-enable no-param-reassign */
        })

        await changePath(newPath)

        const {
          collection,
          collections,
          granule
        } = useEdscStore.getState()

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(collection.getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(collection.getCollectionMetadata).toHaveBeenCalledWith()

        expect(granule.getGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(granule.getGranuleMetadata).toHaveBeenCalledWith()
      })
    })
  })
})
