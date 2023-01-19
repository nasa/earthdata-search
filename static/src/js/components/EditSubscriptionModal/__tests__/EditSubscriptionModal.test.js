import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Form } from 'react-bootstrap'

import EditSubscriptionModal from '../EditSubscriptionModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: false,
    onToggleEditSubscriptionModal: jest.fn(),
    onUpdateSubscription: jest.fn(),
    granuleSubscriptions: [],
    subscriptions: {},
    subscriptionConceptId: '',
    subscriptionType: 'collection'
  }

  const enzymeWrapper = shallow(<EditSubscriptionModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EditSubscriptionModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('Edit Subscription')
  })

  describe('when a collection subscription is defined', () => {
    test('sets the value of the name input', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        subscriptions: {
          byId: {
            SUB1: {
              name: 'Original Name'
            }
          }
        },
        subscriptionConceptId: 'SUB1'
      })
      const modalBody = mount(enzymeWrapper.props().body)
      expect(modalBody.find(Form.Control).props().value).toEqual('Original Name')
    })

    test('defaults the checkbox to unchecked', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        subscriptions: {
          byId: {
            SUB1: {
              name: 'Original Name'
            }
          }
        },
        subscriptionConceptId: 'SUB1'
      })
      const modalBody = mount(enzymeWrapper.props().body)
      expect(modalBody.find(Form.Check).props().checked).toEqual(false)
    })
  })

  describe('when a granule subscription is defined', () => {
    test('sets the value of the name input', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        granuleSubscriptions: [{
          conceptId: 'SUB1',
          name: 'Original Name (Granule)'
        }],
        subscriptionConceptId: 'SUB1',
        subscriptionType: 'granule'
      })
      const modalBody = mount(enzymeWrapper.props().body)
      expect(modalBody.find(Form.Control).props().value).toEqual('Original Name (Granule)')
    })

    test('defaults the checkbox to unchecked', () => {
      const { enzymeWrapper } = setup()

      enzymeWrapper.setProps({
        granuleSubscriptions: [{
          conceptId: 'SUB1',
          name: 'Original Name (Granule)'
        }],
        subscriptionConceptId: 'SUB1',
        subscriptionType: 'granule'
      })
      const modalBody = mount(enzymeWrapper.props().body)
      expect(modalBody.find(Form.Check).props().checked).toEqual(false)
    })
  })

  describe('onSubscriptionEditSubmit', () => {
    test('calls onUpdateSubscription and onToggleEditSubscriptionModal', async () => {
      const { enzymeWrapper, props } = setup()
      enzymeWrapper.setProps({
        subscriptions: {
          byId: {
            SUB1: {
              name: 'Original Name',
              conceptId: 'SUB1',
              nativeId: 'mock-guid'
            }
          }
        },
        subscriptionConceptId: 'SUB1'
      })
      await enzymeWrapper.instance().onSubscriptionEditSubmit()

      expect(props.onUpdateSubscription).toHaveBeenCalledTimes(1)
      expect(props.onUpdateSubscription).toHaveBeenCalledWith({
        shouldUpdateQuery: false,
        subscription: {
          conceptId: 'SUB1',
          name: 'Original Name',
          nativeId: 'mock-guid'
        }
      })
      expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleEditSubscriptionModal).toHaveBeenCalledWith({
        isOpen: false,
        subscriptionConceptId: '',
        type: ''
      })
    })
  })
})
