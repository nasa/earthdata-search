import { UPDATE_CONTACT_INFO } from '../constants/actionTypes'

const initialState = {}

const contactInfoReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_CONTACT_INFO: {
      const { echoPreferences, ursProfile } = action.payload

      return {
        ...state,
        echoPreferences: {
          ...state.echoPreferences,
          ...echoPreferences
        },
        ursProfile: {
          ...state.ursProfile,
          ...ursProfile
        }
      }
    }
    default:
      return state
  }
}

export default contactInfoReducer
