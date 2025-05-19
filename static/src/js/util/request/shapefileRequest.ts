import Request from './request'

// @ts-expect-error Types are not defined for this module
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { RequestParams } from '../../types/sharedTypes'

export default class ShapefileRequest extends Request {
  constructor(earthdataEnvironment: string) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.lambda = true
  }

  fetch(shapefileId: string) {
    return this.get(`shapefiles/${shapefileId}`)
  }

  save(params: RequestParams) {
    return this.post('shapefiles', params)
  }
}
