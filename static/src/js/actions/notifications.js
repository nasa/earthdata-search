import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DISMISSED
} from '../constants/actionTypes'
import {
  toastPlacement,
  toastType
} from '../constants/enums'
import { removeError } from './errors'

const notificationDefaults = {
  appearance: toastType.info,
  autoDismiss: true,
  autoDismissTimeout: 15000,
  placement: toastPlacement.topRight
}

const addToast = (content, notification) => {
  try {
    const { add } = window.reactToastProvider.current
    if (add) {
      add(content, notification)
      return
    }
  } catch (error) {
    console.error(error)
    return
  }
  console.error('Add toast method not available.')
}

export const pushingNotification = notification => ({
  type: PUSHING_NOTIFICATION,
  notification
})

export const notificationPushed = notification => ({
  type: NOTIFICATION_PUSHED,
  notification
})

export const notificationDismissed = notification => ({
  type: NOTIFICATION_DISMISSED,
  notification
})

/**
 * @name pushSuccessNotification
 * @param {React.Node} content
 * @description Generates a default success notification with
 * the content value inside the toast container.
 */
export const pushSuccessNotification = content => (dispatch) => {
  const notification = {
    ...notificationDefaults,
    content,
    appearance: toastType.success
  }
  notification.onDismiss = () => dispatch(notificationDismissed(notification))
  dispatch(pushingNotification(notification))
  addToast(content, notification)
  dispatch(notificationPushed(notification))
}

/**
 * @name pushWarningNotification
 * @param {React.Node} content
 * @description Generates a default warning notification with
 * the content value inside the toast container.
 */
export const pushWarningNotification = content => (dispatch) => {
  const notification = {
    ...notificationDefaults,
    content,
    appearance: toastType.warning,
    autoDismiss: false
  }
  notification.onDismiss = () => dispatch(notificationDismissed(notification))
  dispatch(pushingNotification(notification))
  addToast(content, notification)
  dispatch(notificationPushed(notification))
}

/**
 * @name pushErrorNotification
 * @param {React.Node} content
 * @param {string} errorId
 * @description Generates a default error notification with
 * the content value inside the toast container.
 */
export const pushErrorNotification = (content, errorId) => (dispatch) => {
  const notification = {
    ...notificationDefaults,
    content,
    appearance: toastType.error,
    autoDismiss: false
  }
  notification.onDismiss = () => {
    dispatch(notificationDismissed(notification))
    if (errorId) {
      dispatch(removeError(errorId))
    }
  }
  dispatch(pushingNotification(notification))
  addToast(content, notification)
  dispatch(notificationPushed(notification))
}

/**
 * @name pushInfoNotification
 * @param {React.Node} content
 * @description Generates a default info notification with
 * the content value inside the toast container.
 */
export const pushInfoNotification = content => (dispatch) => {
  const notification = {
    ...notificationDefaults,
    content,
    appearance: toastType.info
  }
  notification.onDismiss = () => dispatch(notificationDismissed(notification))
  dispatch(pushingNotification(notification))
  addToast(content, notification)
  dispatch(notificationPushed(notification))
}

/**
 *
 * @param {React.Node} content
 * @param {string} appearance
 * @param {bool} autoDismiss
 * @param {number} autoDismissTimeout
 * @param {string} placement
 * @param {function} onDismiss
 * @description Generates a notification based on the
 * passed in configuration.
 */
export const pushNotification = (
  content,
  appearance,
  autoDismiss,
  autoDismissTimeout,
  placement,
  onDismiss
) => (dispatch) => {
  const notification = {
    content,
    appearance,
    autoDismiss,
    autoDismissTimeout,
    placement
  }
  notification.onDismiss = () => {
    if (onDismiss) {
      onDismiss()
    }
    dispatch(notificationDismissed(notification))
  }
  dispatch(pushingNotification(notification))
  addToast(content, notification)
  dispatch(notificationPushed(notification))
}
