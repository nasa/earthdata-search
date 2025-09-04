import useEdscStore from '../../useEdscStore'
import { initialGranuleState, initialState } from '../createQuerySlice'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'

import * as EventEmitter from '../../../events/events'

jest.mock('../../../actions', () => ({
  getCollections: jest.fn(),
  getSearchGranules: jest.fn(),
  getRegions: jest.fn(),
  removeSubscriptionDisabledFields: jest.fn(),
  toggleDrawingNewLayer: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createQuerySlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { query } = zustandState

    expect(query).toEqual({
      ...initialState,
      changeQuery: expect.any(Function),
      changeGranuleQuery: expect.any(Function),
      changeRegionQuery: expect.any(Function),
      clearFilters: expect.any(Function),
      clearNlpCollection: expect.any(Function),
      clearNlpSearchCompleted: expect.any(Function),
      excludeGranule: expect.any(Function),
      initializeGranuleQuery: expect.any(Function),
      removeSpatialFilter: expect.any(Function),
      setNlpCollection: expect.any(Function),
      setNlpSearchCompleted: expect.any(Function),
      undoExcludeGranule: expect.any(Function)
    })
  })

  describe('changeQuery', () => {
    describe('when there is no focused collection', () => {
      test('updates the collection query and calls getCollections', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            keyword: 'test'
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.pageNum).toEqual(1)
        expect(updatedQuery.collection.keyword).toEqual('test')

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when there is a focused collection', () => {
      test('updates the collection query and calls getCollections and getSearchGranules', async () => {
        useEdscStore.setState((state) => {
          state.collection.collectionId = 'collectionId'
          state.collections.getCollections = jest.fn()
          state.granules.granules.collectionConceptId = 'collectionId'
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
          state.query.collection.byId.collectionId = {
            granules: {
              ...initialGranuleState,
              pageNum: 2
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            keyword: 'test'
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.pageNum).toEqual(1)
        expect(updatedQuery.collection.keyword).toEqual('test')

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when there is a project collection', () => {
      test('updates the collection query and calls getCollections and getProjectGranules', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.granules.getGranules = jest.fn()
          state.project.collections.allIds = ['collectionId']
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            keyword: 'test'
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.pageNum).toEqual(1)
        expect(updatedQuery.collection.keyword).toEqual('test')

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(0)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(1)
        expect(project.getProjectGranules).toHaveBeenCalledWith()

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when skipCollectionSearch is true', () => {
      test('updates the collection query without calling getCollections', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            keyword: 'test'
          },
          skipCollectionSearch: true
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.pageNum).toEqual(1)
        expect(updatedQuery.collection.keyword).toEqual('test')

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(collections.getCollections).toHaveBeenCalledTimes(0)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when there are spatial values', () => {
      test('updates the store', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            spatial: {
              point: ['0,0']
            }
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.spatial).toEqual({
          point: ['0,0']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()
      })

      test('it changes the spatial values to a new value', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.collection.spatial = {
            point: ['1,1']
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            spatial: {
              polygon: ['-77,38,-77,38,-76,38,-77,38']
            }
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.spatial).toEqual({
          polygon: ['-77,38,-77,38,-76,38,-77,38']
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()
      })

      test('it removes spatial values', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.query.collection.spatial = {
            point: ['1,1']
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          collection: {
            spatial: {}
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.spatial).toEqual(initialState.collection.spatial)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()
      })
    })

    describe('when there is a selectedRegion value', () => {
      test('updates the store', async () => {
        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeQuery } = query
        await changeQuery({
          selectedRegion: {
            id: '1234',
            name: 'Mock Hub',
            spatial: '-77,38,-77,38,-76,38,-77,38',
            type: 'huc'
          }
        })

        const updatedState = useEdscStore.getState()
        const {
          collections,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.selectedRegion).toEqual({
          id: '1234',
          name: 'Mock Hub',
          spatial: '-77,38,-77,38,-76,38,-77,38',
          type: 'huc'
        })

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()
      })
    })
  })

  describe('changeGranuleQuery', () => {
    describe('when the collection does not have a query yet', () => {
      test('updates the granule query and calls actions', async () => {
        useEdscStore.setState((state) => {
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeGranuleQuery } = query
        await changeGranuleQuery({
          collectionId: 'collectionId',
          query: { pageNum: 3 }
        })

        const updatedState = useEdscStore.getState()
        const {
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.byId.collectionId.granules).toEqual({
          ...initialGranuleState,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when the query is empty', () => {
      test('updates the granule query and calls actions', async () => {
        useEdscStore.setState((state) => {
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
          state.query.collection.byId.collectionId = {
            granules: {
              ...initialGranuleState,
              pageNum: 2
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeGranuleQuery } = query
        await changeGranuleQuery({
          collectionId: 'collectionId',
          query: {}
        })

        const updatedState = useEdscStore.getState()
        const {
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.byId.collectionId.granules).toEqual(initialGranuleState)

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when there are new query values', () => {
      test('updates the granule query and calls actions', async () => {
        useEdscStore.setState((state) => {
          state.granules.granules.collectionConceptId = 'collectionId'
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
          state.query.collection.byId.collectionId = {
            granules: {
              ...initialGranuleState,
              pageNum: 2
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeGranuleQuery } = query
        await changeGranuleQuery({
          collectionId: 'collectionId',
          query: { pageNum: 3 }
        })

        const updatedState = useEdscStore.getState()
        const {
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.byId.collectionId.granules).toEqual({
          ...initialGranuleState,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })

    describe('when the collectionId is focused and in the projectCollectionIds', () => {
      test('calls getProjectGranules', async () => {
        useEdscStore.setState((state) => {
          state.collection.collectionId = 'collectionId'
          state.granules.granules.collectionConceptId = 'collectionId'
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
          state.project.collections.allIds = ['collectionId']
          state.query.collection.byId.collectionId = {
            granules: {
              ...initialGranuleState,
              pageNum: 2
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { changeGranuleQuery } = query
        await changeGranuleQuery({
          collectionId: 'collectionId',
          query: { pageNum: 3 }
        })

        const updatedState = useEdscStore.getState()
        const {
          granules,
          project,
          query: updatedQuery
        } = updatedState

        expect(updatedQuery.collection.byId.collectionId.granules).toEqual({
          ...initialGranuleState,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(1)
        expect(project.getProjectGranules).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledTimes(1)
        expect(actions.removeSubscriptionDisabledFields).toHaveBeenCalledWith()
      })
    })
  })

  describe('changeRegionQuery', () => {
    test('updates the region query and calls getRegions', async () => {
      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { changeRegionQuery } = query
      await changeRegionQuery({ keyword: 'test' })

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.region.keyword).toEqual('test')

      expect(actions.getRegions).toHaveBeenCalledTimes(1)
      expect(actions.getRegions).toHaveBeenCalledWith()
    })
  })

  describe('clearFilters', () => {
    describe('when not on the granules page', () => {
      test('updates the region query and calls getRegions', async () => {
        mockGetState.mockReturnValue({
          router: {
            location: {
              pathname: '/search'
            }
          }
        })

        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.granules.getGranules = jest.fn()
          state.project.getProjectCollections = jest.fn()
          state.shapefile.clearShapefile = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { clearFilters } = query
        await clearFilters()

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery,
          shapefile,
          timeline
        } = updatedState

        expect(updatedQuery.collection).toEqual(initialState.collection)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(project.getProjectCollections).toHaveBeenCalledTimes(1)
        expect(project.getProjectCollections).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(0)
        expect(timeline.getTimeline).toHaveBeenCalledTimes(0)

        expect(shapefile.clearShapefile).toHaveBeenCalledTimes(1)
        expect(shapefile.clearShapefile).toHaveBeenCalledWith()
      })
    })

    describe('when on the granules page', () => {
      test('updates the region query and calls getRegions', async () => {
        mockGetState.mockReturnValue({
          router: {
            location: {
              pathname: '/search/granules'
            }
          }
        })

        useEdscStore.setState((state) => {
          state.collections.getCollections = jest.fn()
          state.granules.getGranules = jest.fn()
          state.project.getProjectCollections = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { query } = zustandState
        const { clearFilters } = query
        await clearFilters()

        const updatedState = useEdscStore.getState()
        const {
          collections,
          granules,
          project,
          query: updatedQuery,
          timeline
        } = updatedState

        expect(updatedQuery.collection).toEqual(initialState.collection)

        expect(collections.getCollections).toHaveBeenCalledTimes(1)
        expect(collections.getCollections).toHaveBeenCalledWith()

        expect(project.getProjectCollections).toHaveBeenCalledTimes(1)
        expect(project.getProjectCollections).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
        expect(timeline.getTimeline).toHaveBeenCalledWith()
      })
    })
  })

  describe('excludeGranule', () => {
    test('excludes a granule from the collection', async () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

      useEdscStore.setState((state) => {
        state.granules.getGranules = jest.fn()
        state.query.collection.byId.collectionId = {
          granules: initialGranuleState
        }
      })

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { excludeGranule } = query
      await excludeGranule({
        collectionId: 'collectionId',
        granuleId: 'granuleId'
      })

      const updatedState = useEdscStore.getState()
      const {
        granules,
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.collection.byId.collectionId.granules.excludedGranuleIds).toContain('granuleId')

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(eventEmitterEmitMock).toHaveBeenCalledWith('map.layer.collectionId.hoverGranule', {
        granule: null
      })

      expect(granules.getGranules).toHaveBeenCalledTimes(1)
      expect(granules.getGranules).toHaveBeenCalledWith()
    })
  })

  describe('initializeGranuleQuery', () => {
    test('sets the granule query', () => {
      const collectionId = 'collectionId'
      const granuleQuery = {
        sortKey: '-start_date'
      }

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { initializeGranuleQuery } = query
      initializeGranuleQuery({
        collectionId,
        query: granuleQuery
      })

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.collection.byId.collectionId.granules).toEqual({
        ...initialGranuleState,
        ...granuleQuery
      })
    })
  })

  describe('removeSpatialFilter', () => {
    test('removes the spatial filter', async () => {
      useEdscStore.setState((state) => {
        state.collections.getCollections = jest.fn()
        state.query.collection.byId.collectionId = {
          granules: initialGranuleState
        }

        state.shapefile.clearShapefile = jest.fn()
      })

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { removeSpatialFilter } = query
      await removeSpatialFilter()

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery,
        shapefile
      } = updatedState

      expect(updatedQuery.collection.spatial).toEqual(initialState.collection.spatial)

      expect(actions.toggleDrawingNewLayer).toHaveBeenCalledTimes(1)
      expect(actions.toggleDrawingNewLayer).toHaveBeenCalledWith(false)

      expect(shapefile.clearShapefile).toHaveBeenCalledTimes(1)
      expect(shapefile.clearShapefile).toHaveBeenCalledWith()
    })
  })

  describe('undoExcludeGranule', () => {
    test('removes a granule from the excluded list', async () => {
      useEdscStore.setState((state) => {
        state.granules.getGranules = jest.fn()
        state.query.collection.byId.collectionId = {
          granules: {
            ...initialGranuleState,
            excludedGranuleIds: ['granuleId1', 'granuleId2']
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { undoExcludeGranule } = query
      await undoExcludeGranule('collectionId')

      const updatedState = useEdscStore.getState()
      const {
        granules,
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.collection.byId.collectionId.granules.excludedGranuleIds).not.toContain('granuleId2')

      expect(granules.getGranules).toHaveBeenCalledTimes(1)
      expect(granules.getGranules).toHaveBeenCalledWith()
    })
  })

  describe('setNlpSearchCompleted', () => {
    test('sets the nlpSearchCompleted flag', () => {
      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { setNlpSearchCompleted } = query
      setNlpSearchCompleted(true)

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.nlpSearchCompleted).toBe(true)
    })
  })

  describe('clearNlpSearchCompleted', () => {
    test('clears the nlpSearchCompleted flag', () => {
      useEdscStore.setState((state) => {
        state.query.nlpSearchCompleted = true
      })

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { clearNlpSearchCompleted } = query
      clearNlpSearchCompleted()

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery
      } = updatedState

      expect(updatedQuery.nlpSearchCompleted).toBe(false)
    })
  })
})
