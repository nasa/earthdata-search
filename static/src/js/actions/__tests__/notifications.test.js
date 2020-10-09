import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DISMISSED
} from '../../constants/actionTypes'

import {
  toastType,
  toastPlacement
} from '../../constants/enums'

import {
  pushingNotification,
  notificationPushed,
  notificationDismissed,
  pushNotification,
  pushSuccessNotification,
  pushInfoNotification,
  pushWarningNotification,
  pushErrorNotification
} from '../notifications'

const mockStore = configureMockStore([thunk])

describe('notification actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('pushingNotification', () => {
    test('it should create an action to update the store', () => {
      const mockNotification = {
        appearance: toastType.info,
        autoDismissTimeout: 15000,
        placement: toastPlacement.bottomLeft
      }
      const expectedAction = {
        type: PUSHING_NOTIFICATION,
        notification: mockNotification
      }
      const action = pushingNotification(mockNotification)
      expect(action.notification.appearance).toEqual(mockNotification.appearance)
      expect(action.notification.autoDismissTimeout).toEqual(mockNotification.autoDismissTimeout)
      expect(action.type).toEqual(expectedAction.type)
    })
  })

  describe('notificationPushed', () => {
    test('it should create an action to update the store', () => {
      const mockNotification = {
        appearance: toastType.warn,
        autoDismissTimeout: 15000,
        placement: toastPlacement.bottomLeft
      }
      const expectedAction = {
        type: NOTIFICATION_PUSHED,
        notification: mockNotification
      }
      const action = notificationPushed(mockNotification)
      expect(action.notification.appearance).toEqual(mockNotification.appearance)
      expect(action.notification.autoDismissTimeout).toEqual(mockNotification.autoDismissTimeout)
      expect(action.type).toEqual(expectedAction.type)
    })
  })

  describe('notificationDismissed', () => {
    test('it should create an action to update the store', () => {
      const mockNotification = {
        appearance: toastType.success,
        autoDismissTimeout: 30000,
        placement: toastPlacement.topLeft
      }
      const expectedAction = {
        type: NOTIFICATION_DISMISSED,
        notification: mockNotification
      }
      const action = notificationDismissed(mockNotification)
      expect(action.notification.appearance).toEqual(mockNotification.appearance)
      expect(action.notification.autoDismissTimeout).toEqual(mockNotification.autoDismissTimeout)
      expect(action.type).toEqual(expectedAction.type)
    })
  })

  describe('pushNotification', () => {
    test('it should dispatch actions to update the store', async () => {
      const store = mockStore({})
      const content = 'Custom notification test!'
      const appearance = toastType.warning
      const placement = toastPlacement.bottomCenter
      const autoDismiss = true
      const autoDismissTimeout = 45000
      const onDismiss = jest.fn()
      await store.dispatch(pushNotification(
        content,
        appearance,
        autoDismiss,
        autoDismissTimeout,
        placement,
        onDismiss
      ))
      const storeActions = store.getActions()
      expect(storeActions.length).toEqual(2)
      expect(storeActions[0].type).toEqual(PUSHING_NOTIFICATION)
      expect(storeActions[0].notification.content).toEqual(content)
      expect(storeActions[0].notification.appearance).toEqual(appearance)
      expect(storeActions[0].notification.autoDismiss).toEqual(autoDismiss)
      expect(storeActions[0].notification.placement).toEqual(placement)
      expect(storeActions[1].type).toEqual(NOTIFICATION_PUSHED)
      expect(storeActions[1].notification.content).toEqual(content)
      expect(storeActions[1].notification.appearance).toEqual(appearance)
      expect(storeActions[1].notification.autoDismiss).toEqual(autoDismiss)
      expect(storeActions[1].notification.placement).toEqual(placement)
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
