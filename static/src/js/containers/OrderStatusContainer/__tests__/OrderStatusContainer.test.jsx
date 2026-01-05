import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { mapDispatchToProps, OrderStatusContainer } from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'
import * as metricsActions from '../../../middleware/metrics/actions'

jest.mock('../../../components/OrderStatus/OrderStatus', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusContainer,
  defaultProps: {
    onMetricsRelatedCollection: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onMetricsRelatedCollection calls metricsRelatedCollection', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsActions, 'metricsRelatedCollection')

    mapDispatchToProps(dispatch).onMetricsRelatedCollection({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('OrderStatusContainer component', () => {
  describe('when passed the correct props', () => {
    test('passes its props and renders a single OrderStatus component', () => {
      setup()

      expect(OrderStatus).toHaveBeenCalledTimes(1)
      expect(OrderStatus).toHaveBeenCalledWith(
        {
          onMetricsRelatedCollection: expect.any(Function)
        },
        {}
      )
    })
  })
})
