import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import ChunkedOrderModal from '../ChunkedOrderModal'
import EDSCModalContainer from '../../../containers/EDSCModalContainer/EDSCModalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    isOpen: false,
    location: {
      search: '?p=C100005-EDSC!C100005-EDSC&pg[1][v]=t'
    },
    projectCollectionsMetadata: {
      'C100005-EDSC': {
        title: 'collection title'
      }
    },
    projectCollectionsRequiringChunking: {
      'C100005-EDSC': {
        granules: {
          hits: 9001
        }
      }
    },
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

    expect(enzymeWrapper.find(EDSCModalContainer).length).toEqual(1)
  })

  test('should render a title', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(EDSCModalContainer).prop('title')).toEqual('Per-order Granule Limit Exceeded')
  })

  test('should render instructions', () => {
    const { enzymeWrapper } = setup()

    const message = enzymeWrapper.find(EDSCModalContainer).prop('body').props.children[0].props.children.join('')

    expect(message).toEqual('Orders for data containing more than 2,000 granules will be split into multiple orders. You will receive a set of emails for each order placed.')
  })

  test('should render a \'Refine your search\' link that keeps the project params intact and removes the focused collection', () => {
    const { enzymeWrapper } = setup()

    const { to } = enzymeWrapper.find(EDSCModalContainer).prop('footerMeta').props

    expect(to).toEqual({
      pathname: '/search',
      search: '?p=!C100005-EDSC&pg[1][v]=t'
    })
  })

  describe('modal actions', () => {
    test('\'Refine your search\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModalContainer).prop('footerMeta').props.onClick()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Change access method\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModalContainer).prop('onSecondaryAction')()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)
    })

    test('\'Continue\' button should trigger onToggleChunkedOrderModal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find(EDSCModalContainer).prop('onPrimaryAction')()

      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleChunkedOrderModal).toHaveBeenCalledWith(false)

      expect(props.onSubmitRetrieval).toHaveBeenCalledTimes(1)
    })
  })
})
