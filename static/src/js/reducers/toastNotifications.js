import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DIMISSED
} from '../constants/actionTypes'

const initialState = {
  history: new Map()
}

const pushingNotification = (state, action) => {
  const { notification } = action
  const toastHistory = new Map(state.history)
  toastHistory.set(notification.id, notification)
  return {
    ...state,
    history: toastHistory
  }
}

const notificationPushed = (state, action) => {
  const toastHistory = new Map(state.history)
  const notification = toastHistory.get(action.id)
  notification.pushed = true
  toastHistory.set(action.id, notification)
  return {
    ...state,
    history: toastHistory
  }
}

const notificationDismissed = (state, action) => {
  const toastHistory = new Map(state.history)
  const notification = toastHistory.get(action.id)
  notification.dismissed = true
  toastHistory.set(action.id, notification)
  return {
    ...state,
    history: toastHistory
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PUSHING_NOTIFICATION:
      return pushingNotification(state, action)
    case NOTIFICATION_PUSHED:
      return notificationPushed(state, action)
    case NOTIFICATION_DIMISSED:
      return notificationDismissed(state, action)
    default:
      return state
  }
}
