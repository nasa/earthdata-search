let configs = {}

try {
  // eslint-disable-next-line global-require, import/no-unresolved
  configs = require('../../../../portals/mergedPortalConfigs.json')
} catch {
  // mergedPortalConfigs.json does't exist, using an empty object
}

const initialState = configs

const availablePortalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state
  }
}

export default availablePortalsReducer
