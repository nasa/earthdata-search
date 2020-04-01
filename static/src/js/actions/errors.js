import uuidv4 from 'uuid/v4'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'
import LoggerRequest from '../util/request/loggerRequest'
import { parseError } from '../../../../sharedUtils/parseError'

export const addError = payload => ({
  type: ADD_ERROR,
  payload
})

export const removeError = payload => ({
  type: REMOVE_ERROR,
  payload
})

export const handleError = ({
  error,
  message = 'There was a problem completing the request',
  action,
  resource,
  verb = 'retrieving',
  displayBanner = true,
  requestObject
}) => (dispatch, getState) => {
  const { router = {} } = getState()
  const { location } = router

  let requestId = uuidv4()
  if (requestObject) {
    const { requestId: existingRequestId } = requestObject

    requestId = existingRequestId
  }

  if (displayBanner) {
    dispatch(addError({
      id: requestId,
      title: `Error ${verb} ${resource}`,
      message,
      details: error
    }))
  }

  const parsedError = parseError(error, { asJSON: false })
  const [defaultErrorMessage] = parsedError

  console.error(`Action [${action}] failed:`, defaultErrorMessage)

  // Send the error to be logged in lambda
  const loggerRequest = new LoggerRequest()
  loggerRequest.log({
    error: {
      guid: requestId,
      location,
      message,
      error
    }
  })
}
