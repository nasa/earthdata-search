import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class GenerateNotebookRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.optionallyAuthenticated = true
    this.authToken = authToken
  }

  generateNotebook(params) {
    return this.post('generate_notebook', params)
  }
}
