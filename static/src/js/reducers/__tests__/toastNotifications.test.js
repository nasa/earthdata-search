import uuid from 'uuid/v4'
import toastNotificationsReducer from '../toastNotifications'
import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DIMISSED
} from '../../constants/actionTypes'

const initialState = {
  history: new Map()
}

describe('toastNotifications reducer', () => {
  describe('INITIAL_STATE', () => {
    test('is correct', () => {
      const testAction = { type: 'action' }
      expect(toastNotificationsReducer(undefined, testAction)).toEqual(initialState)
    })
  })

  describe('PUSHING_NOTIFICATION', () => {
    test('returns the correct state', () => {
      const notification = {
        id: uuid(),
        content: 'Test notification from reducer test',
        pushed: false,
        dismissed: false
      }
      const action = {
        type: PUSHING_NOTIFICATION,
        notification
      }
      const state = toastNotificationsReducer(undefined, action)
      expect(state.history.get(notification.id).content).toEqual(notification.content)
      expect(state.history.get(notification.id).pushed).toEqual(false)
      expect(state.history.size).toEqual(1)
    })

    describe('NOTIFICATION_PUSHED', () => {
      test('returns the correct state', () => {
        const notification = {
          id: uuid(),
          content: 'Test notification from reducer test',
          pushed: false,
          dismissed: false
        }
        const pushingAction = {
          type: PUSHING_NOTIFICATION,
          notification
        }
        const pushedAction = {
          type: NOTIFICATION_PUSHED,
          id: notification.id
        }
        let state = toastNotificationsReducer(undefined, pushingAction)
        expect(state.history.get(notification.id).content).toEqual(notification.content)
        expect(state.history.get(notification.id).pushed).toEqual(false)
        state = toastNotificationsReducer(state, pushedAction)
        expect(state.history.get(notification.id).pushed).toEqual(true)
        expect(state.history.size).toEqual(1)
      })
    })

    describe('NOTIFICATION_DISMISSED', () => {
      test('returns the correct state', () => {
        const notification = {
          id: uuid(),
          content: 'Test notification from reducer test',
          pushed: false,
          dismissed: false
        }
        const pushingAction = {
          type: PUSHING_NOTIFICATION,
          notification
        }
        const pushedAction = {
          type: NOTIFICATION_PUSHED,
          id: notification.id
        }
        const dismissAction = {
          type: NOTIFICATION_DIMISSED,
          id: notification.id
        }
        let state = toastNotificationsReducer(undefined, pushingAction)
        expect(state.history.get(notification.id).content).toEqual(notification.content)
        expect(state.history.get(notification.id).pushed).toEqual(false)
        expect(state.history.get(notification.id).dismissed).toEqual(false)
        state = toastNotificationsReducer(state, pushedAction)
        expect(state.history.get(notification.id).pushed).toEqual(true)
        expect(state.history.get(notification.id).dismissed).toEqual(false)
        state = toastNotificationsReducer(state, dismissAction)
        expect(state.history.get(notification.id).dismissed).toEqual(true)
        expect(state.history.size).toEqual(1)
      })
    })
  })
})
