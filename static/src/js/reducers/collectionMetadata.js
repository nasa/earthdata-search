import {
  ADD_COLLECTION_GRANULES,
  EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_METADATA,
  RESTORE_COLLECTIONS,
  UNDO_EXCLUDE_GRANULE_ID,
  CLEAR_COLLECTION_GRANULES
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  projectIds: []
}

const collectionMetadataReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case UPDATE_COLLECTION_METADATA: {
      const [collectionId] = Object.keys(action.payload)
      const allIds = [collectionId]
      const byId = {
        [collectionId]: {
          excludedGranuleIds: [],
          granules: {},
          metadata: action.payload[collectionId]
        }
      }

      if (state.allIds.indexOf(collectionId) !== -1) {
        return {
          ...state,
          allIds: [
            ...state.allIds
          ],
          byId: {
            ...state.byId,
            [collectionId]: {
              excludedGranuleIds: [
                ...state.byId[collectionId].excludedGranuleIds
              ],
              granules: {},
              metadata: action.payload[collectionId]
            }
          }
        }
      }

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
    case ADD_COLLECTION_GRANULES: {
      const { collectionId, granules } = action.payload
      const {
        allIds,
        byId,
        isCwic,
        hits
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
              isCwic,
              hits
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
