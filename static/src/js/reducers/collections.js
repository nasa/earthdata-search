import {
  ADD_COLLECTION_GRANULES,
  EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTIONS,
  RESTORE_COLLECTIONS
} from '../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  projectIds: []
}

const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COLLECTIONS: {
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
      console.log('RESTORE_COLLECTIONS', action.payload)

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

export default collectionsReducer
