import { v4 as uuidv4 } from 'uuid'

import { ErrorsSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import addToast from '../../util/addToast'
// @ts-expect-error There are no types for this file
import { displayNotificationType } from '../../constants/enums'
// @ts-expect-error There are no types for this file
import { parseError } from '../../../../../sharedUtils/parseError'
// @ts-expect-error There are no types for this file
import LoggerRequest from '../../util/request/loggerRequest'
import routerHelper from '../../router/router'

const createErrorsSlice: ImmerStateCreator<ErrorsSlice> = (set, get) => ({
  errors: {
    errorsList: [],

    // Move this code down to where it's called
    addError: (payload) => {
      const { notificationType = 'none' } = payload

      if (notificationType === 'banner') {
        set((state) => {
          state.errors.errorsList.push(payload)
        })
      } else if (notificationType === 'toast') {
        const { message } = payload

        addToast(message, {
          appearance: 'error',
          autoDismiss: false
        })
      }
    },

    removeError: (id) => {
      set((state) => {
        state.errors.errorsList = state.errors.errorsList.filter((error) => error.id !== id)
      })
    },

    handleError: ({
      error,
      message = 'There was a problem completing the request',
      action,
      resource,
      verb = 'retrieving',
      notificationType = displayNotificationType.banner,
      requestObject,
      showAlertButton,
      title
    }) => {
      const { location } = routerHelper?.router?.state || {}

      let requestId = uuidv4()
      if (requestObject) {
        const { requestId: existingRequestId } = requestObject

        if (existingRequestId) {
          requestId = existingRequestId
        }
      }

      const parsedError = parseError(error, { asJSON: false })

      const [defaultErrorMessage = message] = parsedError

      get().errors.addError({
        id: requestId,
        title: title || `Error ${verb} ${resource}`,
        message: defaultErrorMessage,
        notificationType,
        showAlertButton
      })

      console.error(`Action [${action}] failed: ${defaultErrorMessage}`)

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
  }
})

export default createErrorsSlice
