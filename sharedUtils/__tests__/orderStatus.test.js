import { aggregatedOrderStatus } from '../orderStatus'

describe('aggregatedOrderStatus', () => {
  describe('for single order downloads', () => {
    test('returns the correct state for creating', () => {
      expect(aggregatedOrderStatus([])).toEqual('creating')
    })

    test('returns the correct state for failed', () => {
      expect(aggregatedOrderStatus([{
        state: 'not_found'
      }])).toEqual('failed')
    })

    test('returns the correct state for canceled', () => {
      expect(aggregatedOrderStatus([{
        state: 'cancelled'
      }])).toEqual('canceled')
    })

    test('returns the correct state for in progress', () => {
      expect(aggregatedOrderStatus([{
        state: 'submitting'
      }])).toEqual('in progress')
    })

    test('returns the correct state for complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'closed'
      }])).toEqual('complete')
    })
  })

  describe('for multi-order downloads', () => {
    test('returns the correct state when in progress', () => {
      expect(aggregatedOrderStatus([{
        state: 'complete'
      }, {
        state: 'processing'
      }])).toEqual('in progress')
    })

    test('returns the correct state when complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'complete'
      }, {
        state: 'closed'
      }])).toEqual('complete')
    })

    test('returns the correct state when complete', () => {
      expect(aggregatedOrderStatus([{
        state: 'failed'
      }, {
        state: 'failed'
      }])).toEqual('failed')
    })
  })
})
