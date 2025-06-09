import { ReduxUpdatedSlice, ImmerStateCreator } from '../types'

const createReduxUpdatedSlice: ImmerStateCreator<ReduxUpdatedSlice> = (set) => ({
  reduxUpdated: {
    /** Flag to indicate if the Redux store has been updated */
    lastUpdated: 0,
    /** Function to set the reduxUpdated value */
    setLastUpdated: (lastUpdated) => {
      set((state) => {
        state.reduxUpdated.lastUpdated = lastUpdated
      })
    }
  }
})

export default createReduxUpdatedSlice
