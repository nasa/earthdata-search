import { UPDATE_CONTACT_INFO } from '../constants/actionTypes'

const initialState = {}

const contactInfoReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_CONTACT_INFO: {
      const { cmrPreferences, ursProfile } = action.payload

      return {
        ...state,
        cmrPreferences: {
          ...state.cmrPreferences,
          ...cmrPreferences
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
