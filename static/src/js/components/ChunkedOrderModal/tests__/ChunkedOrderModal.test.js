import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import EDSCModal from '../../EDSCModal/EDSCModal'
import ChunkedOrderModal from '../ChunkedOrderModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetdata: {
      byId: {
        'C100005-EDSC': {
          metadata: {
            title: 'collection title'
          }
        }
      }
    },
    location: {},
    project: {
      byId: {
        'C100005-EDSC': {
          orderCount: 4
        }
      },
      collectionsRequiringChunking: ['C100005-EDSC']
    },
    isOpen: false,
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn()
  }

  const enzymeWrapper = shallow(<ChunkedOrderModal {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('ChunkedOrderModal component', () => {
  test('should render a Modal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModal).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModal).prop('title')).toEqual('Per-order Granule Limit Exceeded')
  })

  test('should render instructions', () => {
    const { enzymeWrapper } = setup()

    const message = enzymeWrapper.find(EDSCModal).prop('body').props.children[0].props.children.join('')

    expect(message).toEqual('Orders for data containing more than 2,000 granules will be split into multiple orders. You will receive a set of emails for each order placed.')
  })

  describe('modal actions', () => {
    test('\'Refine your search\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModal).prop('footerMeta').props.onClick()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Change access method\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModal).prop('onSecondaryAction')()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Continue\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModal).prop('onPrimaryAction')()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(1)
    })
  })
})
