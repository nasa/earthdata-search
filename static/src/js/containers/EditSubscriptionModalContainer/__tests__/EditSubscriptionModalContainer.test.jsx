import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  EditSubscriptionModalContainer
} from '../EditSubscriptionModalContainer'
import EditSubscriptionModal from '../../../components/EditSubscriptionModal/EditSubscriptionModal'

jest.mock('../../../components/EditSubscriptionModal/EditSubscriptionModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: EditSubscriptionModalContainer,
  defaultProps: {
    onUpdateSubscription: jest.fn(),
    subscriptions: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onUpdateSubscription calls actions.updateSubscription', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateSubscription')

    mapDispatchToProps(dispatch).onUpdateSubscription('conceptId', 'nativeId', 'subscriptionName', 'subscriptionType')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('conceptId', 'nativeId', 'subscriptionName', 'subscriptionType')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      subscriptions: {}
    }

    const expectedState = {
      subscriptions: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('EditSubscriptionModalContainer component', () => {
  test('passes its props and renders a EditSubscriptionModal component', () => {
    setup()

    expect(EditSubscriptionModal).toHaveBeenCalledTimes(1)
    expect(EditSubscriptionModal).toHaveBeenCalledWith({
      onUpdateSubscription: expect.any(Function),
      subscriptions: {}
    }, {})
  })
})
