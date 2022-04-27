import { v4 as uuidv4 } from 'uuid'

import LoggerRequest from '../util/request/loggerRequest'

export const handleAlert = ({
  message,
  action,
  resource,
  requestObject
}) => (dispatch, getState) => {
  const { router = {} } = getState()
  const { location } = router

  let requestId = uuidv4()
  if (requestObject) {
    const { requestId: existingRequestId } = requestObject

    requestId = existingRequestId
  }

  console.log(`Action [${action}] alert: ${message}`)

  // Send the alert to be logged in lambda
  const loggerRequest = new LoggerRequest()
  loggerRequest.alert({
    alert: {
      action,
      guid: requestId,
      location,
      message,
      resource
    }
  })
}
