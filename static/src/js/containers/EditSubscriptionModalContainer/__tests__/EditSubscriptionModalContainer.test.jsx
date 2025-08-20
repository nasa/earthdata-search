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
    isOpen: true,
    onToggleEditSubscriptionModal: jest.fn(),
    onUpdateSubscription: jest.fn(),
    subscriptionConceptId: 'SUB1',
    subscriptions: {},
    subscriptionType: 'granule'
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleEditSubscriptionModal calls actions.toggleEditSubscriptionModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleEditSubscriptionModal')

    mapDispatchToProps(dispatch).onToggleEditSubscriptionModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  test('onUpdateSubscription calls actions.toggleEditSubscriptionModal', () => {
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
      subscriptions: {

      },
      ui: {
        editSubscriptionModal: {
          isOpen: false,
          subscriptionConceptId: 'SUB1'
        }
      }
    }

    const expectedState = {
      isOpen: false,
      subscriptionConceptId: 'SUB1',
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
      isOpen: true,
      onToggleEditSubscriptionModal: expect.any(Function),
      onUpdateSubscription: expect.any(Function),
      subscriptionConceptId: 'SUB1',
      subscriptions: {},
      subscriptionType: 'granule'
    }, {})
  })
})
