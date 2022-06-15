import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SubscriptionsBody from '../SubscriptionsBody'
import Button from '../../Button/Button'
import { SubscriptionsListItem } from '../SubscriptionsListItem'
import { EmptyListItem } from '../../EmptyListItem/EmptyListItem'

Enzyme.configure({ adapter: new Adapter() })

beforeAll(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
  const props = {
    query: {
      options: {
        spatial: {
          or: true
        }
      }
    },
    onCreateSubscription: jest.fn(),
    onDeleteSubscription: jest.fn(),
    onUpdateSubscription: jest.fn(),
    subscriptions: [],
    subscriptionType: 'granule',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SubscriptionsBody {...props} />)

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

  test('should render intro text', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('.subscriptions-body__intro-text').text())
      .toEqual('Subscribe to be notified by email when new data matching your search query becomes available.')
  })

  describe('create button', () => {
    test('should render when the user can create a subscription', () => {
      const { enzymeWrapper } = setup()
      const introRow = enzymeWrapper.find('.subscriptions-body__row--intro')
      expect(introRow.find(Button).length).toEqual(1)
    })

    // TODO: Assert that the state updates the loading indicator EDSC-2923
    test('calls onCreateSubscription', () => {
      const { enzymeWrapper, props } = setup()
      const introRow = enzymeWrapper.find('.subscriptions-body__row--intro')
      const createButton = introRow.find(Button)

      createButton.simulate('click')

      expect(props.onCreateSubscription).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscription list', () => {
    describe('when the current query already exists', () => {
      test('should show a message about the duplicate query', () => {
        const subOne = {
          name: 'Subscription 1',
          conceptId: 'SUB-1',
          query: 'param=one'
        }

        const subTwo = {
          name: 'Subscription 2',
          conceptId: 'SUB-2',
          query: 'param=two'
        }

        const { enzymeWrapper } = setup({
          query: { param: 'one' },
          subscriptions: [
            subOne,
            subTwo
          ]
        })

        expect(enzymeWrapper.find('.subscriptions-body__warning').length).toEqual(1)
      })

      test('should render the update button as disabled', () => {
        const subOne = {
          name: 'Subscription 1',
          conceptId: 'SUB-1',
          query: 'param=one'
        }

        const subTwo = {
          name: 'Subscription 2',
          conceptId: 'SUB-2',
          query: 'param=two'
        }

        const { enzymeWrapper } = setup({
          query: { param: 'one' },
          subscriptions: [
            subOne,
            subTwo
          ]
        })

        const subscriptionItemOne = enzymeWrapper.find(SubscriptionsListItem).at(0)
        const subscriptionItemTwo = enzymeWrapper.find(SubscriptionsListItem).at(0)

        expect(subscriptionItemOne.props().hasExactlyMatchingGranuleQuery).toEqual(true)
        expect(subscriptionItemTwo.props().hasExactlyMatchingGranuleQuery).toEqual(true)
      })

      describe('when a subscription can be updated', () => {
        test('should render the update button as disabled', () => {
          const subOne = {
            name: 'Subscription 1',
            conceptId: 'SUB-1',
            query: 'param=one'
          }

          const subTwo = {
            name: 'Subscription 2',
            conceptId: 'SUB-2',
            query: 'param=two'
          }

          const { enzymeWrapper } = setup({
            query: {
              param: 'unique'
            },
            subscriptions: [
              subOne,
              subTwo
            ]
          })

          const subscriptionItemOne = enzymeWrapper.find(SubscriptionsListItem).at(0)
          const subscriptionItemTwo = enzymeWrapper.find(SubscriptionsListItem).at(0)

          expect(subscriptionItemOne.props().hasExactlyMatchingGranuleQuery).toEqual(false)
          expect(subscriptionItemTwo.props().hasExactlyMatchingGranuleQuery).toEqual(false)
        })
      })
    })

    describe('when rendering a focused collection', () => {
      describe('when the collection has no subscriptions', () => {
        test('should render an empty list item', () => {
          const { enzymeWrapper } = setup()
          expect(enzymeWrapper.find(EmptyListItem).length)
            .toEqual(1)
        })

        test('should render an link to create a new subscription', () => {
          const { enzymeWrapper, props } = setup()
          const emptyListItem = enzymeWrapper.find(EmptyListItem)
          const newSubButton = emptyListItem.find(Button).at(0)

          newSubButton.simulate('click')

          expect(props.onCreateSubscription).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the collection has subscriptions', () => {
        test('should render children', () => {
          const subOne = {
            name: 'Subscription 1',
            conceptId: 'SUB-1'
          }

          const subTwo = {
            name: 'Subscription 2',
            conceptId: 'SUB-2'
          }

          const { enzymeWrapper } = setup({
            subscriptions: [
              subOne,
              subTwo
            ]
          })

          expect(enzymeWrapper.find('.subscriptions-body__list').children().length)
            .toEqual(2)
          expect(enzymeWrapper.find(SubscriptionsListItem).at(0).props().subscription)
            .toEqual(subOne)
          expect(enzymeWrapper.find(SubscriptionsListItem).at(1).props().subscription)
            .toEqual(subTwo)
        })

        test('should render a view all link', () => {
          const subOne = {
            name: 'Subscription 1',
            conceptId: 'SUB-1'
          }

          const subTwo = {
            name: 'Subscription 2',
            conceptId: 'SUB-2'
          }

          const { enzymeWrapper } = setup({
            subscriptions: [
              subOne,
              subTwo
            ]
          })

          expect(enzymeWrapper.find('.subscriptions-body__view-all-subscriptions').length)
            .toEqual(1)
        })
      })
    })
  })

  describe('when rendering collection search subscriptions', () => {
    describe('when no subscriptions exist', () => {
      test('should render an empty list item', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find(EmptyListItem).length)
          .toEqual(1)
      })

      test('should render an link to create a new subscription', () => {
        const { enzymeWrapper, props } = setup()
        const emptyListItem = enzymeWrapper.find(EmptyListItem)
        const newSubButton = emptyListItem.find(Button).at(0)

        newSubButton.simulate('click')

        expect(props.onCreateSubscription).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the user has subscriptions', () => {
      test('should render the subscriptions', () => {
        const subOne = {
          name: 'Subscription 1',
          conceptId: 'SUB-1'
        }

        const subTwo = {
          name: 'Subscription 2',
          conceptId: 'SUB-2'
        }

        const { enzymeWrapper } = setup({
          subscriptionType: 'collection',
          subscriptions: [
            subOne,
            subTwo
          ]
        })

        expect(enzymeWrapper.find('.subscriptions-body__list').children().length)
          .toEqual(2)
        expect(enzymeWrapper.find(SubscriptionsListItem).at(0).props().subscription)
          .toEqual(subOne)
        expect(enzymeWrapper.find(SubscriptionsListItem).at(1).props().subscription)
          .toEqual(subTwo)
      })
    })
  })

  describe('when a subscription name is not set', () => {
    test('does not set a default name in the input', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {}
      })

      const input = enzymeWrapper.find('.subscriptions-body__text-input')

      expect(input.props().value)
        .toEqual()
    })
  })

  describe('when the user sets a new name', () => {
    test('displays the new name', () => {
      const { enzymeWrapper } = setup({
        subscriptionType: 'collection',
        query: {}
      })

      enzymeWrapper.find('.subscriptions-body__text-input').simulate('change', { target: { value: 'Test Name' } })
      enzymeWrapper.update()
      const input = enzymeWrapper.find('.subscriptions-body__text-input')

      expect(input.props().value)
        .toEqual('Test Name')
    })
  })

  describe('when submitting a new subscription', () => {
    describe('when a name is set', () => {
      test('saves the new name', () => {
        const { enzymeWrapper, props } = setup({
          subscriptionType: 'collection',
          query: {}
        })

        enzymeWrapper.find('.subscriptions-body__text-input').simulate('change', { target: { value: 'Test Name' } })
        enzymeWrapper.update()

        const submitButton = enzymeWrapper.find('.subscriptions-body__create-button')
        submitButton.simulate('click')
        enzymeWrapper.update()

        expect(props.onCreateSubscription)
          .toHaveBeenCalledTimes(1)
      })
    })
  })
})
