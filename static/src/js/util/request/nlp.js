import LambdaRequest from './lambda'

export default class NlpRequest extends LambdaRequest {
  /**
   * Defines the default array keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return [
      'text'
    ]
  }

  search(params) {
    return super.post('nlp', params)
  }
}
