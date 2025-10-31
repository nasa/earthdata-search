import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalCollectionRequest extends Request {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.edlToken = edlToken
  }

  fetch(id) {
    return this.get(`/retrieval_collections/${id}`)
  }
}
