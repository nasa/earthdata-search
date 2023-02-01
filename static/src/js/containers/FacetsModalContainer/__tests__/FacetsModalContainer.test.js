import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { FacetsModalContainer, mapDispatchToProps, mapStateToProps } from '../FacetsModalContainer'
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

describe('mapDispatchToProps', () => {
  test('onChangeViewAllFacet calls actions.changeViewAllFacet', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeViewAllFacet')

    mapDispatchToProps(dispatch).onChangeViewAllFacet({ mock: 'event' }, { mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'event' }, { mock: 'data' })
  })

  test('onToggleFacetsModal calls actions.toggleFacetsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleFacetsModal')

    mapDispatchToProps(dispatch).onToggleFacetsModal(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
  })

  test('onApplyViewAllFacets calls actions.applyViewAllFacets', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyViewAllFacets')

    mapDispatchToProps(dispatch).onApplyViewAllFacets()

    expect(spy).toBeCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      searchResults: {
        viewAllFacets: {
          hits: 42
        }
      },
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      collectionHits: 42,
      viewAllFacets: {
        hits: 42
      },
      isOpen: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

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
