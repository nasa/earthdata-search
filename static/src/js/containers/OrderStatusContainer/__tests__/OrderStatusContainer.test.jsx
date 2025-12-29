import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import { mapDispatchToProps, OrderStatusContainer } from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'

jest.mock('../../../components/OrderStatus/OrderStatus', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusContainer,
  defaultProps: {
    onChangePath: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })
})

describe('OrderStatusContainer component', () => {
  describe('when passed the correct props', () => {
    test('passes its props and renders a single OrderStatus component', () => {
      setup()

      expect(OrderStatus).toHaveBeenCalledTimes(1)
      expect(OrderStatus).toHaveBeenCalledWith(
        {
          onChangePath: expect.any(Function)
        },
        {}
      )
    })
  })
})
