import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { ChunkedOrderModalContainer, mapDispatchToProps, mapStateToProps } from '../ChunkedOrderModalContainer'
import ChunkedOrderModal from '../../../components/ChunkedOrderModal/ChunkedOrderModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    projectCollectionsMetadata: {},
    projectCollectionsRequiringChunking: {},
    location: {},
    project: {},
    isOpen: true,
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn()
  }

  const enzymeWrapper = shallow(<ChunkedOrderModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onToggleChunkedOrderModal calls actions.toggleChunkedOrderModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleChunkedOrderModal')

    mapDispatchToProps(dispatch).onToggleChunkedOrderModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onSubmitRetrieval calls actions.submitRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'submitRetrieval')

    mapDispatchToProps(dispatch).onSubmitRetrieval()

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith()
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      project: {},
      router: {
        location: {}
      },
      ui: {
        chunkedOrderModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false,
      location: {},
      project: {},
      projectCollectionsMetadata: {},
      projectCollectionsRequiringChunking: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ChunkedOrderModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ChunkedOrderModal).length).toBe(1)
    expect(enzymeWrapper.find(ChunkedOrderModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(ChunkedOrderModal).props().onToggleChunkedOrderModal).toEqual('function')
  })
})
