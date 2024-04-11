import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalCollectionRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  fetch(id) {
    return this.get(`/retrieval_collections/${id}`)
  }
}
