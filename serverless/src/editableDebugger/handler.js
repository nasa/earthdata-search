import request from 'request-promise'

const editableDebugger = async () => {
  await request.post({
    uri: '',
    qs: {},
    qsStringifyOptions: {
      indices: false,
      arrayFormat: 'brackets'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    resolveWithFullResponse: true
  })
}

export default editableDebugger
