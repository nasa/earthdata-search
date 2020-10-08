import { toast } from 'react-toastify'
import uuid from 'uuid/v4'

import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DIMISSED
} from '../constants/actionTypes'

export const toastType = {
  info: 'info',
  error: 'error',
  warning: 'warn',
  success: 'success'
}

export const toastPosition = {
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center',
  bottomRight: 'bottom-right',
  topLeft: 'top-left',
  topCenter: 'top-center',
  topRight: 'top-right'
}

const notificationDefaults = {
  type: toastType.info,
  autoClose: 15000,
  position: toastPosition.topRight,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  closeButton: true,
  rtl: false,
  pauseOnVisibilityChange: true,
  draggable: false,
  pauseOnHover: true,
  style: {
    color: '#fcfcfc'
  },
  progressStyle: {
    background: 'navy'
  }
}

// Sets the default notification settings
toast.configure({
  ...notificationDefaults,
  bodyClassName: 'root'
})

export const pushingNotification = notification => ({
  type: PUSHING_NOTIFICATION,
  notification
})

export const notificationPushed = id => ({
  type: NOTIFICATION_PUSHED,
  id
})

export const notificationDismissed = id => ({
  type: NOTIFICATION_DIMISSED,
  id
})

/**
 * @name addNotification
 * @param {object} param0 Notification object.
 * @description Call toast system to render the notification.
 */
const addNotification = ({
  content,
  type,
  autoClose,
  position,
  onClose
}) => {
  toast[type || notificationDefaults.type](content, {
    autoClose,
    position,
    onClose
  })
}

/**
 * @name pushSuccessNotification
 * @param {React.Node} content
 * @description Generates a default success notification with
 * the content value inside the toast container.
 */
export const pushSuccessNotification = content => (dispatch) => {
  const id = uuid()
  const notification = {
    id,
    content,
    type: toastType.success,
    pushed: false,
    dismissed: false,
    onClose: () => dispatch(notificationDismissed(id)),
    time: new Date()
  }
  dispatch(pushingNotification(notification))
  addNotification(notification)
  dispatch(notificationPushed(id))
}

/**
 * @name pushWarningNotification
 * @param {React.Node} content
 * @description Generates a default warning notification with
 * the content value inside the toast container.
 */
export const pushWarningNotification = content => (dispatch) => {
  const id = uuid()
  const notification = {
    id,
    content,
    type: toastType.warning,
    pushed: false,
    dismissed: false,
    onClose: () => dispatch(notificationDismissed(id)),
    time: new Date()
  }
  dispatch(pushingNotification(notification))
  addNotification(notification)
  dispatch(notificationPushed(id))
}

/**
 * @name pushErrorNotification
 * @param {React.Node} content
 * @description Generates a default error notification with
 * the content value inside the toast container.
 */
export const pushErrorNotification = content => (dispatch) => {
  const id = uuid()
  const notification = {
    id,
    content,
    type: toastType.error,
    autoClose: false,
    pushed: false,
    dismissed: false,
    onClose: () => dispatch(notificationDismissed(id)),
    time: new Date()
  }
  dispatch(pushingNotification(notification))
  addNotification(notification)
  dispatch(notificationPushed(id))
}

/**
 * @name pushInfoNotification
 * @param {React.Node} content
 * @description Generates a default info notification with
 * the content value inside the toast container.
 */
export const pushInfoNotification = content => (dispatch) => {
  const id = uuid()
  const notification = {
    id,
    content,
    type: toastType.info,
    autoClose: false,
    pushed: false,
    dismissed: false,
    onClose: () => dispatch(notificationDismissed(id)),
    time: new Date()
  }
  dispatch(pushingNotification(notification))
  addNotification(notification)
  dispatch(notificationPushed(id))
}

/**
 *
 * @param {React.Node} content
 * @param {string} type
 * @param {bool | number} autoClose
 * @param {string} position
 * @param {function} onClose
 * @description Generates a notification based on the
 * passed in configuration.
 */
export const pushNotification = (
  content,
  type,
  autoClose,
  position,
  onClose
) => (dispatch) => {
  const id = uuid()
  const notification = {
    id,
    content,
    type,
    autoClose,
    pushed: false,
    dimissed: false,
    position,
    onClose: () => {
      onClose()
      dispatch(notificationDismissed(id))
    },
    time: new Date()
  }
  dispatch(pushingNotification(notification))
  addNotification(notification)
  dispatch(notificationPushed(id))
}
