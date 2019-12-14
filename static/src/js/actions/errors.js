import uuidv4 from 'uuid/v4'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'
import LoggerRequest from '../util/request/loggerRequest'

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
  action,
  resource,
  verb = 'retrieving',
  displayBanner = true
}) => (dispatch, getState) => {
  const { router = {} } = getState()
  const { location } = router

  const {
    error: message = 'There was a problem completing the request'
  } = error

  const id = uuidv4()

  if (displayBanner) {
    dispatch(addError({
      id,
      title: `Error ${verb} ${resource}`,
      message,
      details: error
    }))
  }

  console.error(`Action [${action}] failed:`, error)

  // Send the error to be logged in lambda
  const requestObject = new LoggerRequest()
  requestObject.log({
    error: {
      guid: id,
      location,
      message,
      error
    }
  }).then(() => {})
}
