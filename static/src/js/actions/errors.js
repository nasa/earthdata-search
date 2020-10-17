import uuidv4 from 'uuid/v4'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'
import LoggerRequest from '../util/request/loggerRequest'
import { parseError } from '../../../../sharedUtils/parseError'
import { displayNotificationType } from '../constants/enums'
import addToast from '../util/addToast'

export const addError = payload => (dispatch) => {
  // Default the notificationType to none
  const { notificationType = 'none' } = payload

  if (notificationType === 'banner') {
    dispatch({
      type: ADD_ERROR,
      payload
    })
  } else if (notificationType === 'toast') {
    const { message } = payload

    // Disable autoDismiss for errors
    addToast(message, {
      appearance: 'error',
      autoDismiss: false
    })
  }
}

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
  notificationType = displayNotificationType.banner,
  requestObject
}) => (dispatch, getState) => {
  const { router = {} } = getState()
  const { location } = router

  let requestId = uuidv4()
  if (requestObject) {
    const { requestId: existingRequestId } = requestObject

    requestId = existingRequestId
  }

  dispatch(addError({
    id: requestId,
    title: `Error ${verb} ${resource}`,
    message,
    details: error,
    notificationType
  }))

  const parsedError = parseError(error, { asJSON: false })
  const [defaultErrorMessage = message] = parsedError

  console.error(`Action [${action}] failed: ${defaultErrorMessage}`)

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
