import { isEmpty } from 'lodash-es'

import { QuerySlice, ImmerStateCreator } from '../types'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import configureStore from '../../store/configureStore'
// @ts-expect-error This file does not have types
import actions from '../../actions'

import { getCollectionId } from '../selectors/collection'
import { getProjectCollectionsIds } from '../selectors/project'

import isPath from '../../util/isPath'
// @ts-expect-error This file does not have types
import { pruneFilters } from '../../util/pruneFilters'

import { eventEmitter } from '../../events/events'

import routerHelper, { type Router } from '../../router/router'

const { collectionSearchResultsSortKey } = getApplicationConfig()

export const initialState = {
  collection: {
    byId: {},
    hasGranulesOrCwic: true,
    keyword: '',
    onlyEosdisCollections: false,
    overrideTemporal: {},
    pageNum: 1,
    sortKey: collectionSearchResultsSortKey,
    spatial: {},
    tagKey: '',
    temporal: {}
  },
  region: {
    exact: false
  },
  selectedRegion: {},
  nlpCollection: null
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
      set((state) => {
        // Default the spatial value to the existing object
        let spatialValue = state.query.collection.spatial

        // If the query contains spatial information, use it
        if (query.collection?.spatial) {
          spatialValue = query.collection.spatial
        }

        const newSpatial = {
          ...initialState.collection.spatial,
          ...spatialValue
        }

        state.query.collection = {
          ...state.query.collection,
          pageNum: 1,
          ...query.collection,
          spatial: newSpatial
        }

        if (query.selectedRegion) {
          state.query.selectedRegion = query.selectedRegion
        }

        // Clear the collectionConceptId in order to ensure granules are requested in `getGranules`
        state.granules.granules.collectionConceptId = null
      })

      get().collections.getCollections()

      // If there is a focused collection, update it's granule search params
      // and request it's granules started with page one
      const focusedCollectionId = getCollectionId(get())
      if (focusedCollectionId) {
        set((state) => {
          state.query.collection.byId[focusedCollectionId].granules.pageNum = 1
        })

        get().granules.getGranules()
      }

      // If there are collections in the project, update their respective granule results
      const projectCollectionsIds = getProjectCollectionsIds(get())
      if (projectCollectionsIds.length > 0) {
        await get().project.getProjectGranules()
      }

      // Clear any subscription disabledFields
      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },

    changeGranuleQuery: async ({ collectionId, query }) => {
      set((state) => {
        // Clear the collectionConceptId in order to ensure granules are requested in `getGranules`
        state.granules.granules.collectionConceptId = null

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

      const focusedCollectionId = getCollectionId(get())
      const projectCollectionsIds = getProjectCollectionsIds(get())
      if (focusedCollectionId && projectCollectionsIds.includes(focusedCollectionId)) {
        await get().project.getProjectGranules()
      }

      get().granules.getGranules()

      const {
        dispatch: reduxDispatch
      } = configureStore()
      // Clear any subscription disabledFields
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },

    changeRegionQuery: (query) => {
      set((state) => {
        state.query.region = {
          ...state.query.region,
          ...query
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.getRegions())
    },

    clearFilters: async () => {
      get().facetParams.resetFacetParams()
      get().shapefile.clearShapefile()

      set((state) => ({
        query: {
          ...state.query,
          ...initialState
        }
      }))

      get().collections.getCollections()

      get().project.getProjectCollections()

      // Don't request granules unless we are viewing granules
      const { location } = routerHelper.router?.state || {} as Router['state']
      const { pathname } = location

      if (isPath(pathname, ['/search/granules'])) {
        get().granules.getGranules()

        get().timeline.getTimeline()
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

        // `granules.getGranules()` has logic to avoid making a duplicate request. In order to ensure
        // the request is made after excluding a granule, reset the collectionConceptId here before
        // calling `granules.getGranules()`
        state.granules.granules.collectionConceptId = null
      })

      get().granules.getGranules()
    },

    initializeGranuleQuery: ({ collectionId, query }) => {
      set((state) => {
        state.query.collection.byId[collectionId] = {
          granules: {
            ...initialGranuleState,
            ...query
          }
        }
      })
    },

    removeSpatialFilter: async () => {
      await get().query.changeQuery({
        collection: {
          spatial: initialState.collection.spatial
        },
        region: {
          exact: false
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      reduxDispatch(actions.toggleDrawingNewLayer(false))

      get().shapefile.clearShapefile()
    },

    undoExcludeGranule: (collectionId) => {
      set((state) => {
        const collection = state.query.collection.byId[collectionId]
        if (collection) {
          collection.granules.excludedGranuleIds.pop()
        }

        // `granules.getGranules()` has logic to avoid making a duplicate request. In order to ensure
        // the request is made after excluding a granule, reset the collectionConceptId here before
        // calling `granules.getGranules()`
        state.granules.granules.collectionConceptId = null
      })

      get().granules.getGranules()
    }

  }
})

export default createQuerySlice
