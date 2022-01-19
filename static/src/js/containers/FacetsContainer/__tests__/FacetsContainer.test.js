import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, FacetsContainer } from '../FacetsContainer'
import Facets from '../../../components/Facets/Facets'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    facetsById: {},
    featureFacets: {},
    portal: {},
    onChangeCmrFacet: jest.fn(),
    onChangeFeatureFacet: jest.fn(),
    onTriggerViewAllFacets: jest.fn()
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  const enzymeWrapper = shallow(<FacetsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeCmrFacet calls actions.changeCmrFacet', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeCmrFacet')

    mapDispatchToProps(dispatch).onChangeCmrFacet({ mock: 'event' }, 'facetLinkInfo', 'facet', 'applied')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'event' }, 'facetLinkInfo', 'facet', 'applied')
  })

  test('onChangeFeatureFacet calls actions.changeFeatureFacet', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFeatureFacet')

    mapDispatchToProps(dispatch).onChangeFeatureFacet({ mock: 'event' }, 'facetLinkInfo')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'event' }, 'facetLinkInfo')
  })

  test('onTriggerViewAllFacets calls actions.triggerViewAllFacets', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'triggerViewAllFacets')

    mapDispatchToProps(dispatch).onTriggerViewAllFacets('category')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('category')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      facetsParams: {
        feature: {}
      },
      searchResults: {
        facets: {
          byId: {}
        }
      },
      portal: {}
    }

    const expectedState = {
      searchResults: {
        facets: {
          byId: {}
        }
      },
      featureFacets: {},
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FacetsContainer component', () => {
  test('passes its props and renders a single Facets component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Facets).length).toBe(1)
    expect(enzymeWrapper.find(Facets).props().facets).toEqual({})
    expect(enzymeWrapper.find(Facets).props().featureFacets).toEqual({})
    expect(enzymeWrapper.find(Facets).props().portal).toEqual({})
    expect(typeof enzymeWrapper.find(Facets).props().onChangeCmrFacet).toEqual('function')
    expect(typeof enzymeWrapper.find(Facets).props().onChangeFeatureFacet).toEqual('function')
    expect(typeof enzymeWrapper.find(Facets).props().onTriggerViewAllFacets).toEqual('function')
  })
})
