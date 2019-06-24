const downloadMethod = {
  download: {
    type: 'download'
  }
}

// TODO Finish echoOrderMethod and other methods
const echoOrderMethod = {
  echoOrder: {
    type: 'ECHO_ORDER'
  }
}
// const opendapMethod
// const egiMethod

/**
 * Returns an empty access method based on the provided methodName
 * @param {string} methodName Access method name
 */
const emptyAccessMethod = (methodName) => {
  switch (methodName) {
    case 'download':
      return downloadMethod
    case 'echoOrder':
      return echoOrderMethod
    case 'opendap':
      return {}
    case 'egi':
      return {}
    default:
      return downloadMethod
  }
}

export default emptyAccessMethod
