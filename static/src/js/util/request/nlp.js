import Request from './request'

export default class NlpRequest extends Request {
  permittedCmrKeys() {
    return [
      'text'
    ]
  }

  search(params) {
    return super.post('nlp', params)
  }
}
