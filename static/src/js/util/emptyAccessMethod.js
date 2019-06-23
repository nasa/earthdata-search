const downloadMethod = {
  download: {
    type: 'download'
  }
}

// TODO
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
    default:
      return downloadMethod
  }
}

export default emptyAccessMethod
