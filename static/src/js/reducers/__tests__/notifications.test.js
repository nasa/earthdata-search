import notificationsReducer from '../notifications'
import {
  PUSHING_NOTIFICATION,
  NOTIFICATION_PUSHED,
  NOTIFICATION_DISMISSED
} from '../../constants/actionTypes'

const initialState = {}

describe('notifications reducer', () => {
  describe('INITIAL_STATE', () => {
    test('is correct', () => {
      const testAction = { type: 'action' }
      expect(notificationsReducer(undefined, testAction)).toEqual(initialState)
    })
  })

  describe('PUSHING_NOTIFICATION', () => {
    test('returns the correct state', () => {
      const action = {
        type: PUSHING_NOTIFICATION,
        notification: { content: 'pushing test' }
      }
      const state = notificationsReducer(undefined, action)
      expect(state).toEqual(initialState)
    })

    describe('NOTIFICATION_PUSHED', () => {
      test('returns the correct state', () => {
        const pushingAction = {
          type: PUSHING_NOTIFICATION,
          notification: { content: 'pushing test' }
        }
        const pushedAction = {
          type: NOTIFICATION_PUSHED,
          notification: { content: 'pushed test' }
        }
        const firstState = notificationsReducer(undefined, pushingAction)
        expect(firstState).toEqual(initialState)
        const secondState = notificationsReducer(firstState, pushedAction)
        expect(secondState).toEqual(firstState)
      })
    })

    describe('NOTIFICATION_DISMISSED', () => {
      test('returns the correct state', () => {
        const pushingAction = {
          type: PUSHING_NOTIFICATION,
          notification: { content: 'pushing test' }
        }
        const pushedAction = {
          type: NOTIFICATION_PUSHED,
          notification: { content: 'pushed test' }
        }
        const dismissAction = {
          type: NOTIFICATION_DISMISSED,
          notification: { content: 'dismissed test' }
        }
        const firstState = notificationsReducer(undefined, pushingAction)
        expect(firstState).toEqual(initialState)
        const secondState = notificationsReducer(firstState, pushedAction)
        expect(secondState).toEqual(firstState)
        const thirdState = notificationsReducer(secondState, dismissAction)
        expect(thirdState).toEqual(secondState)
      })
    })
  })
})
