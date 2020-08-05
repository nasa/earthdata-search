export const emptyDecodedResult = {
  advancedSearch: undefined,
  cmrFacets: {
    data_center_h: undefined,
    instrument_h: undefined,
    platform_h: undefined,
    processing_level_id_h: undefined,
    project_h: undefined,
    science_keywords_h: undefined
  },
  collections: undefined,
  featureFacets: {
    customizable: false,
    mapImagery: false,
    nearRealTime: false
  },
  focusedCollectionId: undefined,
  focusedGranuleId: undefined,
  map: {},
  project: undefined,
  query: {
    collection: {
      pageNum: 1,
      gridName: undefined,
      keyword: undefined,
      overrideTemporal: {},
      spatial: {
        boundingBox: undefined,
        circle: undefined,
        point: undefined,
        polygon: undefined
      },
      temporal: {},
      hasGranulesOrCwic: true
    },
    granule: {
      pageNum: 1,
      gridCoords: undefined
    }
  },
  shapefile: {
    shapefileId: ''
  },
  timeline: undefined
}
