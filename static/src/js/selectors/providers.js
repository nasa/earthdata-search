/**
 * Retrieve stored providers from Redux
 * @param {Object} state Current state of Redux
 */
export const getProviders = (state) => {
  const { providers = [] } = state

  return providers
}
