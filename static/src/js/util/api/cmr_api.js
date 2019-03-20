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
        sortKey
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
      callback: ({ collectionId } = {}) => API.post(`collections/${collectionId}/granules`)
    },
    {
      name: 'getOne',
      callback: ({ granuleId } = {}) => API.get(`granules/${granuleId}`)
    }
  ]
}
