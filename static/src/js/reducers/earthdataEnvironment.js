import { RESTORE_FROM_URL } from '../constants/actionTypes'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'

const initialState = deployedEnvironment()

const earthdataEnvironmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_FROM_URL: {
      const { earthdataEnvironment = initialState } = action.payload

      return earthdataEnvironment
    }
    default:
      return state
  }
}

export default earthdataEnvironmentReducer
