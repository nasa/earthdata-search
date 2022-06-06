import { RESTORE_FROM_URL } from '../constants/actionTypes'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'

const earthdataEnvironmentReducer = (state = deployedEnvironment(), action = {}) => {
  switch (action.type) {
    case RESTORE_FROM_URL: {
      const { earthdataEnvironment = state } = action.payload

      return earthdataEnvironment
    }
    default:
      return state
  }
}

export default earthdataEnvironmentReducer
