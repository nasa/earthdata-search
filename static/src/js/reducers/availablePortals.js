import mergedPortalConfigs from '../../../../portals/mergedPortalConfigs.json'

const initialState = mergedPortalConfigs

const availablePortalsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    default:
      return state
  }
}

export default availablePortalsReducer
