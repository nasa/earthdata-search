import Request from './request'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class GenerateNotebookRequest extends Request {
  constructor(edlToken, earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.optionallyAuthenticated = true
    this.edlToken = edlToken
  }

  generateNotebook(params) {
    return this.post('generate_notebook', params)
  }
}
