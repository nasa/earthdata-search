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
    subscription: {
      collectionId: 'COLL-ID-1',
      conceptId: 'SUB1',
      name: 'Subscription 1',
      query: 'options[spatial][or]=true'
    },
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

  describe('edit button', () => {
    test('should render', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.subscriptions-list-item__action').at(0).props().label)
        .toEqual('Edit Subscription')
    })

    describe('when clicked', () => {
      test('should log to the console', () => {
        const consoleMock = jest.fn()
        console.log = consoleMock

        const { enzymeWrapper } = setup()
        enzymeWrapper.find('.subscriptions-list-item__action').at(0).simulate('click')

        expect(consoleMock).toHaveBeenCalledTimes(1)
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
      test('should log to the console', () => {
        const consoleMock = jest.fn()
        console.log = consoleMock

        const { enzymeWrapper } = setup()
        enzymeWrapper.find('.subscriptions-list-item__action').at(1).simulate('click')

        expect(consoleMock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
