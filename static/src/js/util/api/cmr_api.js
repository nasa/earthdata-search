import API from '../api'

export const collectionsEndpoints = {
  name: 'collections',
  endpoints: [
    {
      name: 'getAll',
      callback: ({
        boundingBox,
        hasGranules,
        hasGranulesOrCwic,
        includeFacets,
        includeGranuleCounts,
        includeHasGranules,
        includeTags,
        keyword,
        options,
        pageNum,
        pageSize,
        point,
        polygon,
        scienceKeywordsH,
        sortKey,
        platformH,
        instrumentH,
        dataCenterH,
        projectH,
        processingLevelId
      } = {}) => API.post('collections', {
        params: {
          bounding_box: boundingBox,
          has_granules: hasGranules,
          has_granules_or_cwic: hasGranulesOrCwic,
          include_facets: includeFacets,
          include_granule_counts: includeGranuleCounts,
          include_has_granules: includeHasGranules,
          include_tags: includeTags,
          keyword,
          options,
          page_num: pageNum,
          page_size: pageSize,
          point,
          polygon,
          science_keywords_h: scienceKeywordsH,
          platform_h: platformH,
          instrument_h: instrumentH,
          data_center_h: dataCenterH,
          project_h: projectH,
          processing_level_id_h: processingLevelId,
          sort_key: sortKey
        }
      })
    },
    {
      name: 'getOne',
      callback: ({ collectionId } = {}) => API.get(`collections/${collectionId}`)
    }
  ]
}

export const granulesEndpoints = {
  name: 'granules',
  endpoints: [
    {
      name: 'getAll',
      callback: ({
        collectionId,
        pageNum,
        pageSize,
        sortKey
      } = {}) => API.post(`granules/${collectionId}`, {
        params: {
          echo_collection_id: collectionId,
          page_num: pageNum,
          page_size: pageSize,
          sort_key: sortKey
        }
      })
    },
    {
      name: 'getOne',
      callback: ({ granuleId } = {}) => API.get(`granules/${granuleId}`)
    }
  ]
}
