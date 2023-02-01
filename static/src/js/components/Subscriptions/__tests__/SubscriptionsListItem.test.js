import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import SubscriptionsListItem from '../SubscriptionsListItem'
import SubscriptionsQueryList from '../../SubscriptionsList/SubscriptionsQueryList'

Enzyme.configure({ adapter: new Adapter() })

beforeAll(() => {
  jest.clearAllMocks()
})

const defaultSubscription = {
  collectionConceptId: 'COLL-ID-1',
  conceptId: 'SUB1',
  nativeId: 'SUB1-NATIVE-ID',
  name: 'Subscription 1',
  query: 'options[spatial][or]=true',
  creationDate: '2022-06-14 12:00:00',
  revisionDate: '2022-06-14 12:00:00'
}

function setup(overrideProps) {
  const props = {
    exactlyMatchingSubscriptions: [],
    hasExactlyMatchingGranuleQuery: false,
    hasNullCmrQuery: false,
    subscription: defaultSubscription,
    subscriptionType: 'granule',
    onDeleteSubscription: jest.fn(),
    onToggleEditSubscriptionModal: jest.fn(),
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

  test('should render the created date', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.subscriptions-list-item__meta-item').at(0).text())
      .toEqual('Created: 2022-06-14 12:00:00')
  })

  describe('when the collection has been revised', () => {
    test('displays the revision date', () => {
      const { enzymeWrapper } = setup({
        subscription: {
          ...defaultSubscription,
          revisionDate: '2022-06-15 12:00:00'
        }
      })
      expect(enzymeWrapper.find('.subscriptions-list-item__meta-item').at(0).text())
        .toEqual('Updated: 2022-06-15 12:00:00')
    })
  })

  test('should render the query', () => {
    const { enzymeWrapper } = setup()
    const { tooltip } = enzymeWrapper.find('.subscriptions-list-item__actions').childAt(0).props()
    expect(tooltip.props.children[1].type)
      .toEqual(SubscriptionsQueryList)
  })

  describe('edit button', () => {
    test('should render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.subscriptions-list-item__action').at(1).props().label)
        .toEqual('Edit Subscription')
    })

    describe('when clicked', () => {
      test('should call onUpdateSubscription', () => {
        const { enzymeWrapper, props } = setup()
        enzymeWrapper.find('.subscriptions-list-item__action').at(1).simulate('click')

        expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledTimes(1)
        expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledWith({
          isOpen: true,
          subscriptionConceptId: 'SUB1',
          type: 'granule'
        })
      })
    })

    describe('when viewing a matching subscription', () => {
      test('allows editing', () => {
        const { enzymeWrapper } = setup({
          exactlyMatchingSubscriptions: [{
            conceptId: 'SUB1'
          }]
        })
        expect(enzymeWrapper.find('.subscriptions-list-item__action').at(1).props().disabled).toEqual(false)
      })
    })

    describe('when viewing a matching subscription', () => {
      test('disabled editing', () => {
        const { enzymeWrapper } = setup({
          exactlyMatchingSubscriptions: [{
            conceptId: 'SUB2'
          }]
        })
        expect(enzymeWrapper.find('.subscriptions-list-item__action').at(1).props().disabled).toEqual(true)
      })
    })
  })

  describe('delete button', () => {
    test('should render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.subscriptions-list-item__action').at(2).props().label)
        .toEqual('Delete Subscription')
    })

    describe('when clicked', () => {
      describe('if the user denies the action', () => {
        test('should do nothing', () => {
          const confirmMock = jest.fn(() => false)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(2).simulate('click')

          expect(props.onDeleteSubscription).toHaveBeenCalledTimes(0)
        })
      })

      describe('if the user allows the action', () => {
        test('should call onDeleteSubscription', () => {
          const confirmMock = jest.fn(() => true)
          window.confirm = confirmMock

          const { enzymeWrapper, props } = setup()
          enzymeWrapper.find('.subscriptions-list-item__action').at(2).simulate('click')

          expect(props.onDeleteSubscription).toHaveBeenCalledTimes(1)
          expect(props.onDeleteSubscription).toHaveBeenCalledWith('SUB1', 'SUB1-NATIVE-ID', 'COLL-ID-1')
        })
      })
    })
  })
})
