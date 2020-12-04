import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SubscriptionsBody from '../SubscriptionsBody'
import Button from '../../Button/Button'
import { SubscriptionsListItem } from '../SubscriptionsListItem'

Enzyme.configure({ adapter: new Adapter() })

beforeAll(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
  const props = {
    granuleQueryString: 'options[spatial][or]=true',
    onCreateSubscription: jest.fn(),
    subscriptions: [],
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
      .toEqual('Subscribe to be notified by email when new data matching your search query becomes available for this collection.')
  })

  describe('create button', () => {
    test('should render when the user can create a subscription', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Button).length).toEqual(1)
    })

    test('calls onCreateSubscription', () => {
      const { enzymeWrapper, props } = setup()
      const createButton = enzymeWrapper.find(Button)

      createButton.simulate('click')

      expect(props.onCreateSubscription).toHaveBeenCalledTimes(1)
    })
  })

  describe('subscription list', () => {
    describe('when the collection has no subscriptions', () => {
      test('should render no children', () => {
        const { enzymeWrapper } = setup()
        expect(enzymeWrapper.find('.subscriptions-body__list').children().length)
          .toEqual(0)
      })
    })

    describe('when the collection has subscriptions', () => {
      test('should render no children', () => {
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
    })
  })
})
