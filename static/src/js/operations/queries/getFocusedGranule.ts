const GET_FOCUSED_GRANULE = `
  query GetFocusedGranule(
    $params: GranuleInput
  ) {
    granule(
      params: $params
    ) {
      granuleUr
      granuleSize
      title
      onlineAccessFlag
      dayNightFlag
      timeStart
      timeEnd
      dataCenter
      originalFormat
      conceptId
      collectionConceptId
      spatialExtent
      temporalExtent
      relatedUrls
      dataGranule
      measuredParameters
      providerDates
    }
  }
`

export default GET_FOCUSED_GRANULE
