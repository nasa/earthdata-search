import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { ChunkedOrderModalContainer } from '../ChunkedOrderModalContainer'
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

describe('ChunkedOrderModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(ChunkedOrderModal).length).toBe(1)
    expect(enzymeWrapper.find(ChunkedOrderModal).props().isOpen).toEqual(true)
    expect(typeof enzymeWrapper.find(ChunkedOrderModal).props().onToggleChunkedOrderModal).toEqual('function')
  })
})
