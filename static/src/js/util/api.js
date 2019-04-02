import axios from 'axios'
import { collectionsEndpoints, granulesEndpoints } from './api/cmr_api'
import nlpEndpoints from './api/nlp_api'

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

  post(endpoint, body = {}) {
    return axios.post(`${this.url}/${endpoint}`, body)
  }

  static createEndpoints({ endpoints }) {
    const endpointsObj = {}
    endpoints.forEach((endpoint) => {
      endpointsObj[endpoint.name] = endpoint.callback
    })

    return endpointsObj
  }
}

const API = new APIWrapper({ url: 'http://localhost:3001' })

// CMR
API.buildEntity(collectionsEndpoints)
API.buildEntity(granulesEndpoints)

// NLP
API.buildEntity(nlpEndpoints)

export default API
