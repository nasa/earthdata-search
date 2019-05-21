import Request from './request'

export default class NlpRequest extends Request {
  constructor() {
    super('http://localhost:3001')
    this.lambda = true
    this.searchPath = 'nlp'
  }

  /**
   * Defines the default array keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return [
      'text'
    ]
  }
}
