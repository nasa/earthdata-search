import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SubscriptionsListItem from '../SubscriptionsListItem'

Enzyme.configure({ adapter: new Adapter() })

beforeAll(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
  const props = {
    hasExactlyMatchingGranuleQuery: false,
    subscription: {
      collectionConceptId: 'COLL-ID-1',
      conceptId: 'SUB1',
      nativeId: 'SUB1-NATIVE-ID',
      name: 'Subscription 1',
      query: 'options[spatial][or]=true'
    },
    subscriptionType: 'granule',
    onDeleteSubscription: jest.fn(),
    onUpdateSubscription: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SubscriptionsListItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SubscriptionsBody component', () => {
  test('should render self', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.type()).not.toBe(null)
  })

  test('should render the name', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.subscriptions-list-item__name').text())
      .toEqual('Subscription 1')
  })

  test('should render the query', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.subscriptions-list-item__query-text').text())
      .toEqual('Options: {"spatial":{"or":"true"}}')
  })

  describe('update button', () => {
    test('should render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.subscriptions-list-item__action').at(0).props().label)
        .toEqual('Update Subscription')
    })

    describe('when clicked', () => {
      describe('if the user denies the action', () => {
        test('should do nothing', () => {
          const confirmMock = jest.fn(() => false)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(0).simulate('click')

          expect(props.onUpdateSubscription).toHaveBeenCalledTimes(0)
        })
      })

      describe('if the user allows the action', () => {
        test('should call onUpdateSubscription', () => {
          const confirmMock = jest.fn(() => true)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(0).simulate('click')

          expect(props.onUpdateSubscription).toHaveBeenCalledTimes(1)
          expect(props.onUpdateSubscription).toHaveBeenCalledWith('SUB1', 'SUB1-NATIVE-ID', 'Subscription 1', 'granule')
        })
      })
    })
  })

  describe('delete button', () => {
    test('should render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.subscriptions-list-item__action').at(1).props().label)
        .toEqual('Delete Subscription')
    })

    describe('when clicked', () => {
      describe('if the user denies the action', () => {
        test('should do nothing', () => {
          const confirmMock = jest.fn(() => false)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(1).simulate('click')

          expect(props.onDeleteSubscription).toHaveBeenCalledTimes(0)
        })
      })

      describe('if the user allows the action', () => {
        test('should call onDeleteSubscription', () => {
          const confirmMock = jest.fn(() => true)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(1).simulate('click')

          expect(props.onDeleteSubscription).toHaveBeenCalledTimes(1)
          expect(props.onDeleteSubscription).toHaveBeenCalledWith('SUB1', 'SUB1-NATIVE-ID', 'COLL-ID-1')
        })
      })
    })
  })
})
