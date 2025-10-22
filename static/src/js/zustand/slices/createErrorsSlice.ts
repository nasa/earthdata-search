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

      const errorPayload = {
        id: requestId,
        title: title || `Error ${verb} ${resource}`,
        message: defaultErrorMessage,
        notificationType,
        showAlertButton
      }

      if (notificationType === 'banner') {
        set((state) => {
          state.errors.errorsList.push(errorPayload)
        })
      } else if (notificationType === 'toast') {
        addToast(errorPayload.message, {
          appearance: 'error',
          autoDismiss: false
        })
      }

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
