import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import { mapDispatchToProps, OrderStatusContainer } from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'
import * as metricsActions from '../../../middleware/metrics/actions'

jest.mock('../../../components/OrderStatus/OrderStatus', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusContainer,
  defaultProps: {
    onChangePath: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    onToggleAboutCSDAModal: jest.fn()
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

  test('onToggleAboutCSDAModal calls actions.onToggleAboutCSDAModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAboutCSDAModal')

    mapDispatchToProps(dispatch).onToggleAboutCSDAModal(true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(true)
  })

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
          onChangePath: expect.any(Function),
          onMetricsRelatedCollection: expect.any(Function),
          onToggleAboutCSDAModal: expect.any(Function)
        },
        {}
      )
    })
  })
})
