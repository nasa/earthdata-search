const getFocusedGranuleMetadata = (granuleId, granules) => {
  if (!granules) return {}

  const granule = granules.byId[granuleId]

  if (!granule) return {}

  return {
    [granuleId]: {
      ...granule
    }
  }
}

export default getFocusedGranuleMetadata
