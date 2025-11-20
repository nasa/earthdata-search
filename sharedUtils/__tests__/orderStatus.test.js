import { ORDER_STATES } from '../../sharedConstants/orderStates'
import { aggregatedOrderStatus } from '../orderStatus'

describe('aggregatedOrderStatus', () => {
  describe('for single order downloads', () => {
    test('returns the correct state for creating', () => {
      expect(aggregatedOrderStatus([])).toEqual('creating')
    })

    test('returns the correct state for failed', () => {
      expect(aggregatedOrderStatus([{
        state: 'not_found'
      }])).toEqual(ORDER_STATES.FAILED)
    })

    test('returns the correct state for canceled', () => {
      expect(aggregatedOrderStatus([{
        state: 'cancelled'
      }])).toEqual(ORDER_STATES.CANCELED)
    })

    test('returns the correct state for in progress', () => {
      expect(aggregatedOrderStatus([{
        state: 'submitting'
      }])).toEqual(ORDER_STATES.IN_PROGRESS)
    })

    test('returns the correct state for complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'closed'
      }])).toEqual(ORDER_STATES.COMPLETE)
    })
  })

  describe('for multi-order downloads', () => {
    test('returns the correct state when in progress', () => {
      expect(aggregatedOrderStatus([{
        state: 'complete'
      }, {
        state: 'processing'
      }])).toEqual(ORDER_STATES.IN_PROGRESS)
    })

    test('returns the correct state when complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'complete'
      }, {
        state: 'closed'
      }])).toEqual(ORDER_STATES.COMPLETE)
    })

    test('returns the correct state when complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'failed'
      }, {
        state: 'failed'
      }])).toEqual(ORDER_STATES.FAILED)
    })

    test('returns the correct state when complete for running errors', () => {
      expect(aggregatedOrderStatus([{
        state: 'running_with_errors'
      }])).toEqual(ORDER_STATES.IN_PROGRESS)
    })
  })
})
