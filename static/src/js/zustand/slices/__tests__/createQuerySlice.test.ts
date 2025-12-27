import useEdscStore from '../../useEdscStore'
import { initialState } from '../createQuerySlice'

import * as EventEmitter from '../../../events/events'
import routerHelper from '../../../router/router'

// @ts-expect-error This file does not have types
import { initialGranuleQuery } from '../../../util/url/collectionsEncoders'

describe('createQuerySlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { query } = zustandState

    expect(query).toEqual({
      ...initialState,
      changeQuery: expect.any(Function),
      changeGranuleQuery: expect.any(Function),
      clearFilters: expect.any(Function),
      excludeGranule: expect.any(Function),
      initializeGranuleQuery: expect.any(Function),
      removeSpatialFilter: expect.any(Function),
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
              ...initialGranuleQuery,
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
          ...initialGranuleQuery,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()
      })
    })

    describe('when the query is empty', () => {
      test('updates the granule query and calls actions', async () => {
        useEdscStore.setState((state) => {
          state.granules.getGranules = jest.fn()
          state.project.getProjectGranules = jest.fn()
          state.query.collection.byId.collectionId = {
            granules: {
              ...initialGranuleQuery,
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

        expect(updatedQuery.collection.byId.collectionId.granules).toEqual(initialGranuleQuery)

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()
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
              ...initialGranuleQuery,
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
          ...initialGranuleQuery,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(0)

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()
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
              ...initialGranuleQuery,
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
          ...initialGranuleQuery,
          pageNum: 3
        })

        expect(granules.granules.collectionConceptId).toEqual(null)

        expect(project.getProjectGranules).toHaveBeenCalledTimes(1)
        expect(project.getProjectGranules).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()
      })
    })
  })

  describe('clearFilters', () => {
    describe('when not on the granules page', () => {
      test('updates the query and calls get functions', async () => {
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
      test('updates the query and calls get functions', async () => {
        routerHelper.router = {
          navigate: jest.fn(),
          state: {
            location: {
              pathname: '/search/granules',
              search: ''
            }
          },
          subscribe: jest.fn()
        }

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
          granules: initialGranuleQuery
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
      expect(updatedQuery.collection.byId.collectionId.granules.pageNum).toEqual(1)

      expect(granules.granules.collectionConceptId).toBeNull()
      expect(granules.granules.items).toEqual([])

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
        ...initialGranuleQuery,
        ...granuleQuery
      })
    })
  })

  describe('removeSpatialFilter', () => {
    test('removes the spatial filter', async () => {
      useEdscStore.setState((state) => {
        state.collections.getCollections = jest.fn()
        state.query.collection.byId.collectionId = {
          granules: initialGranuleQuery
        }

        state.shapefile.clearShapefile = jest.fn()
        state.ui.map.setDrawingNewLayer = jest.fn()
      })

      const zustandState = useEdscStore.getState()
      const { query } = zustandState
      const { removeSpatialFilter } = query
      await removeSpatialFilter()

      const updatedState = useEdscStore.getState()
      const {
        query: updatedQuery,
        shapefile,
        ui
      } = updatedState

      expect(updatedQuery.collection.spatial).toEqual(initialState.collection.spatial)

      expect(ui.map.setDrawingNewLayer).toHaveBeenCalledTimes(1)
      expect(ui.map.setDrawingNewLayer).toHaveBeenCalledWith(false)

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
            ...initialGranuleQuery,
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
      expect(updatedQuery.collection.byId.collectionId.granules.pageNum).toEqual(1)

      expect(granules.granules.collectionConceptId).toBeNull()
      expect(granules.granules.items).toEqual([])

      expect(granules.getGranules).toHaveBeenCalledTimes(1)
      expect(granules.getGranules).toHaveBeenCalledWith()
    })
  })
})
