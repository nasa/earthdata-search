import { createSelector } from 'reselect'

/**
 * Retrieve all handoffs data from Redux
 * @param {Object} state Current state of Redux
 */
export const getHandoffs = (state) => {
  const { handoffs = {} } = state

  return handoffs
}

/**
 * Retrieve handoffs sotoLayers from Redux
 */
export const getSotoLayers = createSelector(
  [getHandoffs],
  (handoffs) => {
    const { sotoLayers = [] } = handoffs

    return sotoLayers
  }
)
