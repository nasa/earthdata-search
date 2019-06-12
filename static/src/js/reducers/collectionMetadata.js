import {
  COPY_GRANULE_RESULTS_TO_COLLECTION,
  CLEAR_COLLECTION_GRANULES,
  EXCLUDE_GRANULE_ID,
  RESTORE_COLLECTIONS,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_METADATA,
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  UPDATE_PROJECT_GRANULES,
  TOGGLE_COLLECTION_VISIBILITY
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  projectIds: []
}

const processResults = (results) => {
  const byId = {}
  const allIds = []
  results.forEach((result) => {
    const { id } = result
    byId[id] = result
    allIds.push(id)
  })

  return { byId, allIds }
}

const collectionMetadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COLLECTION_TO_PROJECT: {
      if (state.projectIds.indexOf(action.payload) !== -1) return state

      return {
        ...state,
        projectIds: [
          ...state.projectIds,
          action.payload
        ]
      }
    }
    case CLEAR_COLLECTION_GRANULES: {
      const byId = {}

      state.allIds.forEach((id) => {
        const collection = state.byId[id]
        const { excludedGranuleIds, metadata } = collection
        byId[id] = {
          excludedGranuleIds,
          granules: {},
          metadata
        }
      })

      return {
        ...state,
        byId
      }
    }
    case REMOVE_COLLECTION_FROM_PROJECT: {
      const { projectIds } = state
      const index = projectIds.indexOf(action.payload)

      return {
        ...state,
        projectIds: [
          ...state.projectIds.slice(0, index),
          ...state.projectIds.slice(index + 1)
        ]
      }
    }
    case UPDATE_COLLECTION_METADATA: {
      const allIds = []
      const byId = {
        ...state.byId
      }
      action.payload.forEach((collection, index) => {
        const [collectionId] = Object.keys(collection)
        const { metadata, ummMetadata, formattedMetadata } = action.payload[index][collectionId]

        if (state.allIds.indexOf(collectionId) === -1) allIds.push(collectionId)

        let excludedGranuleIds = []
        let isCwic = false
        let isVisible = true
        if (state.byId[collectionId]) {
          ({
            excludedGranuleIds,
            isCwic,
            isVisible
          } = state.byId[collectionId])
        }
        byId[collectionId] = {
          excludedGranuleIds,
          granules: {},
          isCwic,
          isVisible,
          metadata,
          ummMetadata,
          formattedMetadata
        }
      })

      return {
        ...state,
        allIds: [
          ...state.allIds,
          ...allIds
        ],
        byId: {
          ...state.byId,
          ...byId
        }
      }
    }
    case RESTORE_COLLECTIONS: {
      return {
        ...state,
        ...action.payload
      }
    }
    case EXCLUDE_GRANULE_ID: {
      const { collectionId, granuleId } = action.payload

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            excludedGranuleIds: [
              ...state.byId[collectionId].excludedGranuleIds,
              granuleId
            ]
          }
        }
      }
    }
    case UNDO_EXCLUDE_GRANULE_ID: {
      const collectionId = action.payload
      const excludedGranuleIds = [...state.byId[collectionId].excludedGranuleIds]
      excludedGranuleIds.pop()

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            excludedGranuleIds
          }
        }
      }
    }
    case COPY_GRANULE_RESULTS_TO_COLLECTION: {
      const { collectionId, granules } = action.payload
      const {
        allIds,
        byId,
        hits,
        isCwic,
        totalSize
      } = granules

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              allIds,
              byId,
              hits,
              isCwic,
              totalSize
            }
          }
        }
      }
    }
    case TOGGLE_COLLECTION_VISIBILITY: {
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload]: {
            ...state.byId[action.payload],
            isVisible: !state.byId[action.payload].isVisible
          }
        }
      }
    }
    case UPDATE_PROJECT_GRANULES: {
      const {
        collectionId,
        hits,
        isCwic,
        totalSize
      } = action.payload
      const { byId, allIds } = processResults(action.payload.results)

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: {
            ...state.byId[collectionId],
            granules: {
              allIds,
              byId,
              hits,
              isCwic,
              totalSize
            }
          }
        }
      }
    }
    default:
      return state
  }
}

export default collectionMetadataReducer
