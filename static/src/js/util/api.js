import axios from 'axios'

class APIWrapper {
  constructor({ url }) {
    this.url = url
    this.endpoints = {}
    this.createEndpoints = this.constructor.createEndpoints.bind(this)
  }

  buildEntity(entity) {
    this.endpoints[entity.name] = this.createEndpoints(entity)
  }

  buildEntities(entitiesArray) {
    entitiesArray.forEach(this.buildEntity.bind(this))
  }

  get(endpoint, options = {}) {
    return axios.get(`${this.url}/${endpoint}`, options)
  }

  static createEndpoints({ endpoints }) {
    const endpointsObj = {}
    endpoints.forEach((endpoint) => {
      endpointsObj[endpoint.name] = endpoint.callback
    })

    return endpointsObj
  }
}

const API = new APIWrapper({ url: 'http://localhost:3000' })

API.buildEntity({
  name: 'collections',
  endpoints: [
    {
      name: 'getAll',
      callback: ({
        keyword,
        point,
        boundingBox,
        polygon,
        hasGranules,
        hasGranulesOrCwic,
        includeHasGranules,
        includeGranuleCounts,
        includeFacets,
        includeTags,
        sortKey,
        pageSize,
        pageNum
      } = {}) => API.get('collections', {
        params: {
          keyword,
          point,
          bounding_box: boundingBox,
          polygon,
          has_granules: hasGranules,
          include_granule_counts: includeGranuleCounts,
          include_has_granules: includeHasGranules,
          has_granules_or_cwic: hasGranulesOrCwic,
          include_facets: includeFacets,
          sort_key: sortKey,
          include_tags: includeTags,
          page_size: pageSize,
          page_num: pageNum
        }
      })
    },
    {
      name: 'getOne',
      callback: ({ collectionId } = {}) => API.get(`collections/${collectionId}`)
    }
  ]
})

API.buildEntity({
  name: 'granules',
  endpoints: [
    {
      name: 'getAll',
      callback: ({ collectionId } = {}) => API.get(`collections/${collectionId}/granules`)
    },
    {
      name: 'getOne',
      callback: ({ granuleId } = {}) => API.get(`granules/${granuleId}`)
    }
  ]
})

export default API
