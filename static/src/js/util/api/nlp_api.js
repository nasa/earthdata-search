import API from '../api'

export default {
  name: 'nlp',
  endpoints: [
    {
      name: 'search',
      callback: ({
        text
      } = {}) => API.post('nlp', {
        params: {
          text
        }
      })
    }
  ]
}
