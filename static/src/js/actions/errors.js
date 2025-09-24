import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'
import FailedToLoadCollectionsMessage from '../components/FailedToLoadCollectionsMessage/FailedToLoadCollectionsMessage'

import { addToast } from '../util/addToast'
import { displayNotificationType } from '../constants/enums'
import { parseError } from '../../../../sharedUtils/parseError'

import LoggerRequest from '../util/request/loggerRequest'
import routerHelper from '../router/router'

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
}) => (dispatch) => {
  const { location } = routerHelper.router.state

  let requestId = uuidv4()
  if (requestObject) {
    const { requestId: existingRequestId } = requestObject

    requestId = existingRequestId
  }

  const parsedError = parseError(error, { asJSON: false })

  // Use the first element of the errorArray returned from parseError
  // defaulting to the `message` argument provided to this action
  const [defaultErrorMessage = message] = parsedError

  // Use a custom error banner when the fetchSubscriptions action throws the error
  if (action === 'fetchSubscriptions') {
    const handleAlertsClick = () => {
      const openAlerts = () => {
        const alertsButton = document.querySelector('.th-status-link')

        if (alertsButton) {
          alertsButton.click()
        }
      }

      // 0ms timeout required for the alerts to open correctly
      setTimeout(() => openAlerts(), 0)
    }

    dispatch(addError({
      id: requestId,
      title: 'Something went wrong fetching collection results',
      message: React.createElement(FailedToLoadCollectionsMessage, {
        onAlertsClick: handleAlertsClick
      }),
      notificationType
    }))
  } else {
    dispatch(addError({
      id: requestId,
      title: `Error ${verb} ${resource}`,
      message: defaultErrorMessage,
      notificationType
    }))
  }

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
