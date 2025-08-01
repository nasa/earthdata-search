import { isEmpty } from 'lodash-es'

import { QuerySlice, ImmerStateCreator } from '../types'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import configureStore from '../../store/configureStore'
// @ts-expect-error This file does not have types
import actions from '../../actions'

// @ts-expect-error This file does not have types
import { CLEAR_FILTERS } from '../../constants/actionTypes'

// @ts-expect-error This file does not have types
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getProjectCollectionsIds } from '../selectors/project'

import isPath from '../../util/isPath'
// @ts-expect-error This file does not have types
import { pruneFilters } from '../../util/pruneFilters'

import { eventEmitter } from '../../events/events'

const { collectionSearchResultsSortKey } = getApplicationConfig()

export const initialState = {
  collection: {
    byId: {},
    hasGranulesOrCwic: true,
    keyword: '',
    overrideTemporal: {},
    pageNum: 1,
    sortKey: collectionSearchResultsSortKey,
    spatial: {
      boundingBox: [],
      circle: [],
      line: [],
      point: [],
      polygon: []
    },
    temporal: {}
  },
  region: {
    exact: false
  }
}

export const initialGranuleState = {
  excludedGranuleIds: [],
  gridCoords: '',
  pageNum: 1,
  sortKey: '-start_date'
}

const createQuerySlice: ImmerStateCreator<QuerySlice> = (set, get) => ({
  query: {
    ...initialState,

    changeQuery: async (query) => {
      set((state) => ({
        query: {
          ...state.query,
          collection: {
            ...state.query.collection,
            pageNum: 1,
            ...query.collection,
            spatial: {
              ...initialState.collection.spatial,
              ...query.collection?.spatial
            }
          }
        }
      }))

      const {
        dispatch: reduxDispatch,
        getState: getReduxState
      } = configureStore()
      const reduxState = getReduxState()
      reduxDispatch(actions.getCollections())

      // If there is a focused collection, update it's granule search params
      // and request it's granules started with page one
      const focusedCollectionId = getFocusedCollectionId(reduxState)
      if (focusedCollectionId) {
        set((state) => ({
          query: {
            ...state.query,
            collection: {
              ...state.query.collection,
              byId: {
                ...state.query.collection.byId,
                [focusedCollectionId]: {
                  ...state.query.collection.byId[focusedCollectionId],
                  granules: {
                    ...state.query.collection.byId[focusedCollectionId].granules,
                    pageNum: 1
                  }
                }
              }
            }
          }
        }))

        reduxDispatch(actions.getSearchGranules())
      }

      // If there are collections in the project, update their respective granule results
      const projectCollectionsIds = getProjectCollectionsIds(get())
      if (projectCollectionsIds.length > 0) {
        await get().project.getProjectGranules()
      }

      // Clear any subscription disabledFields
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },

    changeGranuleQuery: async ({ collectionId, query }) => {
      set((state) => {
        if (!get().query.collection.byId[collectionId]) {
          state.query.collection.byId[collectionId] = {
            granules: initialGranuleState
          }
        }

        const prunedQuery = pruneFilters(query)

        if (isEmpty(prunedQuery)) {
          state.query.collection.byId[collectionId].granules = {
            ...initialGranuleState
          }
        } else {
          state.query.collection.byId[collectionId].granules = {
            ...initialGranuleState,
            ...state.query.collection.byId[collectionId]?.granules,
            ...prunedQuery
          }
        }
      })

      const {
        dispatch: reduxDispatch,
        getState: getReduxState
      } = configureStore()
      const reduxState = getReduxState()

      const focusedCollectionId = getFocusedCollectionId(reduxState)
      const projectCollectionsIds = getProjectCollectionsIds(get())
      if (focusedCollectionId && projectCollectionsIds.includes(focusedCollectionId)) {
        await get().project.getProjectGranules()
      }

      reduxDispatch(actions.getSearchGranules())

      // Clear any subscription disabledFields
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },

    changeProjectQuery: async (query) => {
      set((state) => ({
        query: {
          ...state.query,
          ...query,
          collection: {
            ...state.query.collection,
            ...query.collection
          }
        }
      }))

      await get().project.getProjectGranules()
    },

    changeRegionQuery: (query) => {
      set((state) => ({
        query: {
          ...state.query,
          region: {
            ...state.query.region,
            ...query
          }
        }
      }))

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.getRegions())
    },

    clearFilters: async () => {
      get().facetParams.resetFacetParams()

      set((state) => ({
        query: {
          ...state.query,
          ...initialState
        }
      }))

      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()

      // TODO EDSC-4510, update when advanced search is in Zustand
      reduxDispatch({ type: CLEAR_FILTERS })

      reduxDispatch(actions.getCollections())

      await get().project.getProjectCollections()

      // Don't request granules unless we are viewing granules
      const reduxState = reduxGetState()
      const { router } = reduxState
      const { location } = router
      const { pathname } = location
      if (isPath(pathname, ['/search/granules'])) {
        reduxDispatch(actions.getSearchGranules())

        await get().timeline.getTimeline()
      }
    },

    excludeGranule: ({
      collectionId,
      granuleId
    }) => {
      // Unfocus any granule on the map
      eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: null })

      set((state) => {
        const collection = state.query.collection.byId[collectionId]
        if (collection) {
          collection.granules.excludedGranuleIds.push(granuleId)
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.getSearchGranules())
    },

    removeSpatialFilter: async () => {
      await get().query.changeQuery({
        collection: {
          spatial: {}
        },
        region: {
          exact: false
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.toggleDrawingNewLayer(false))

      await get().shapefile.clearShapefile()
    },

    undoExcludeGranule: (collectionId) => {
      set((state) => {
        const collection = state.query.collection.byId[collectionId]
        if (collection) {
          collection.granules.excludedGranuleIds.pop()
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.getSearchGranules())
    }
  }
})

export default createQuerySlice
