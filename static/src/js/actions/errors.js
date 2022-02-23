import uuidv4 from 'uuid/v4'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'

import { addToast } from '../util/addToast'
import { displayNotificationType } from '../constants/enums'
import { parseError } from '../../../../sharedUtils/parseError'

import LoggerRequest from '../util/request/loggerRequest'

export const addError = (payload) => (dispatch) => {
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

export const removeError = (payload) => ({
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
  requestObject,
  errorAction
}) => (dispatch, getState) => {
  const { router = {} } = getState()
  const { location } = router

  let requestId = uuidv4()
  if (requestObject) {
    const { requestId: existingRequestId } = requestObject

    requestId = existingRequestId
  }

  const parsedError = parseError(error, { asJSON: false })

  // Use the first element of the errorArray returned from parseError
  // defaulting to the `message` argument provided to this action
  const [defaultErrorMessage = message] = parsedError

  dispatch(addError({
    id: requestId,
    title: `Error ${verb} ${resource}`,
    message: defaultErrorMessage,
    notificationType
  }))

  if (errorAction) {
    dispatch(errorAction(defaultErrorMessage))
  }

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
