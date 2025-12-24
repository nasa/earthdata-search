import { v4 as uuidv4 } from 'uuid'

// @ts-expect-error This file does not have types
import LoggerRequest from './request/loggerRequest'
import routerHelper, { type Router } from '../router/router'

export const handleAlert = ({
  message,
  action,
  resource,
  requestObject
}: {
  message: string,
  action: string,
  resource?: string,
  requestObject?: {
    requestId: string
  }
}) => {
  const { location } = routerHelper.router?.state || {} as Router['state']

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
