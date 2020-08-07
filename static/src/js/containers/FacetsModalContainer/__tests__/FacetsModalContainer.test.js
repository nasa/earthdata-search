import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { FacetsModalContainer } from '../FacetsModalContainer'
import FacetsModal from '../../../components/Facets/FacetsModal'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionHits: 1,
    isOpen: true,
    onApplyViewAllFacets: jest.fn(),
    onChangeViewAllFacet: jest.fn(),
    onToggleFacetsModal: jest.fn(),
    viewAllFacets: { value: 'viewAllFacets' }
  }

  const enzymeWrapper = shallow(<FacetsModalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FacetsModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(FacetsModal).length).toBe(1)
    expect(enzymeWrapper.find(FacetsModal).props().collectionHits).toEqual(1)
    expect(enzymeWrapper.find(FacetsModal).props().isOpen).toEqual(true)

    expect(typeof enzymeWrapper.find(FacetsModal).props().onApplyViewAllFacets).toEqual('function')
    expect(typeof enzymeWrapper.find(FacetsModal).props().onChangeViewAllFacet).toEqual('function')
    expect(typeof enzymeWrapper.find(FacetsModal).props().onToggleFacetsModal).toEqual('function')

    expect(enzymeWrapper.find(FacetsModal).props().viewAllFacets).toEqual({ value: 'viewAllFacets' })
  })
})
