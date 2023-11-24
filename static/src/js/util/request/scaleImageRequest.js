import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class ScaleImageRequest extends Request {
  constructor(earthdataEnvironment) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)
    this.lambda = true
  }

  // TODO do these have to be divided up by concept_type?
  getScaledImage(conceptType, conceptId) {
    return this.get(`scale/${conceptType}/${conceptId}`)
  }
}
