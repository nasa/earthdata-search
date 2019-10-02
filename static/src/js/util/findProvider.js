/**
 * Get full details for a provider from legacy services based on the provided id
 * @param {Ojbect} state Current Redux State
 * @param {String} id ID of the provider to find (e.g. LPDAAC_ECS)
 */
export const findProvider = (state, id) => {
  const {
    providers
  } = state

  return providers.find((element) => {
    const { provider } = element
    const { provider_id: providerId } = provider

    return providerId === id
  })
}

export default findProvider
