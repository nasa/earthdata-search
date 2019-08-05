import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalCollectionRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  fetch(id) {
    return this.get(`/retrieval_collection/${id}`)
  }
}
