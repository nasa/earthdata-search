import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { OrderStatusContainer } from '../OrderStatusContainer'
import OrderStatus from '../../../components/OrderStatus/OrderStatus'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<OrderStatusContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatusContainer component', () => {
  describe('when passed the correct props', () => {
    test('passes its props and renders a single OrderStatus component', () => {
      const { enzymeWrapper, props } = setup({
        authToken: 'testToken',
        onFetchOrder: jest.fn(),
        match: {
          search: {
            id: 7
          }
        },
        onChangePath: jest.fn(),
        order: {
          id: 7,
          collections: {
            download: [
              {
                collection_id: 'TEST_COLLECTION_111'
              }
            ],
            echoOrder: [],
            order: []
          }
        }
      })

      expect(enzymeWrapper.find(OrderStatus).length).toBe(1)
      expect(enzymeWrapper.find(OrderStatus).props().authToken).toEqual(props.authToken)
      expect(enzymeWrapper.find(OrderStatus).props().fetchOrder).toEqual(props.fetchOrder)
      expect(enzymeWrapper.find(OrderStatus).props().onChangePath).toEqual(props.onChangePath)
      expect(enzymeWrapper.find(OrderStatus).props().order).toEqual(props.order)
    })
  })
})
