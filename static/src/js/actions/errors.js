import uuidv4 from 'uuid/v4'

import { REMOVE_ERROR, ADD_ERROR } from '../constants/actionTypes'

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
  verb = 'retrieving'
}) => (dispatch) => {
  const {
    error: message = 'There was a problem completing the request'
  } = error

  dispatch(addError({
    id: uuidv4(),
    title: `Error ${verb} ${resource}`,
    message,
    details: error
  }))

  console.error(`Action [${action}] failed:`, error)
}
