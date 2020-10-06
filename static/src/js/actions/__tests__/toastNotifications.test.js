import configureMockStore from 'redux-mock-store'
import uuid from 'uuid/v4'
import thunk from 'redux-thunk'

import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DIMISSED
} from '../../constants/actionTypes'

import {
  pushingNotification,
  notificationPushed,
  notificationDismissed,
  pushNotification,
  pushSuccessNotification,
  pushInfoNotification,
  pushWarningNotification,
  pushErrorNotification,
  ToastPosition,
  ToastType
} from '../toastNotifications'

const mockStore = configureMockStore([thunk])

describe('toastNotification actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('pushingNotification', () => {
    test('it should create an action to update the store', () => {
      const id = uuid()
      const notification = {
        id,
        type: ToastType.info,
        autoClose: 15000,
        position: ToastPosition.bottomLeft,
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
      const expectedAction = {
        type: PUSHING_NOTIFICATION,
        notification
      }
      expect(pushingNotification(notification)).toEqual(expectedAction)
    })
  })

  describe('notificationPushed', () => {
    test('it should create an action to update the store', () => {
      const id = uuid()
      const expectedAction = {
        type: NOTIFICATION_PUSHED,
        id
      }
      expect(notificationPushed(id)).toEqual(expectedAction)
    })
  })

  describe('notificationDismissed', () => {
    test('it should create an action to update the store', () => {
      const id = uuid()
      const expectedAction = {
        type: NOTIFICATION_DIMISSED,
        id
      }
      expect(notificationDismissed(id)).toEqual(expectedAction)
    })
  })

  describe('pushNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const content = 'Custom notification test!'
      const type = ToastType.warning
      const autoClose = 1
      const position = ToastPosition.bottomCenter
      await store.dispatch(pushNotification(
        content,
        type,
        autoClose,
        position
      ))
      const storeActions = store.getActions()
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[0].notification.content).toEqual(content)
      expect(storeActions[0].notification.type).toEqual(type)
      expect(storeActions[0].notification.autoClose).toEqual(1)
      expect(storeActions[0].notification.position).toEqual(position)
      expect(storeActions[0].notification).toHaveProperty('time')
      expect(storeActions[0].notification).toHaveProperty('id')
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions[1].id).toEqual(storeActions[0].notification.id)
    })
  })

  describe('pushSuccessNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const notificationContent = 'Success notification test!'
      await store.dispatch(pushSuccessNotification(notificationContent))
      const storeActions = store.getActions()
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions.length).toEqual(2)
    })
  })

  describe('pushInfoNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const notificationContent = 'Info notification test!'
      await store.dispatch(pushInfoNotification(notificationContent))
      const storeActions = store.getActions()
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions.length).toEqual(2)
    })
  })

  describe('pushWarningNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const notificationContent = 'Warning notification test!'
      await store.dispatch(pushWarningNotification(notificationContent))
      const storeActions = store.getActions()
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions.length).toEqual(2)
    })
  })

  describe('pushErrorNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const notificationContent = 'Error notification test!'
      await store.dispatch(pushErrorNotification(notificationContent))
      const storeActions = store.getActions()
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions.length).toEqual(2)
    })
  })
})
