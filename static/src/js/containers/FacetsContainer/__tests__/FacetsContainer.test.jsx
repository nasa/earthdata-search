import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Facets from '../../../components/Facets/Facets'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  FacetsContainer
} from '../FacetsContainer'

jest.mock('../../../components/Facets/Facets', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: FacetsContainer,
  defaultProps: {
    facetsById: {},
    featureFacets: {},
    portal: {},
    onChangeCmrFacet: jest.fn(),
    onChangeFeatureFacet: jest.fn(),
    onTriggerViewAllFacets: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onChangeCmrFacet calls actions.changeCmrFacet', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeCmrFacet')

    mapDispatchToProps(dispatch).onChangeCmrFacet({ mock: 'event' }, 'facetLinkInfo', 'facet', 'applied')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'event' }, 'facetLinkInfo', 'facet', 'applied')
  })

  test('onChangeFeatureFacet calls actions.changeFeatureFacet', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeFeatureFacet')

    mapDispatchToProps(dispatch).onChangeFeatureFacet({ mock: 'event' }, 'facetLinkInfo')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'event' }, 'facetLinkInfo')
  })

  test('onTriggerViewAllFacets calls actions.triggerViewAllFacets', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'triggerViewAllFacets')

    mapDispatchToProps(dispatch).onTriggerViewAllFacets('category')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('category')
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
      }
    }

    const expectedState = {
      facetsById: {},
      featureFacets: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FacetsContainer component', () => {
  test('Renders the facets component with the correct the props', async () => {
    setup()

    expect(Facets).toHaveBeenCalledTimes(1)
    expect(Facets).toHaveBeenCalledWith({
      facetsById: {},
      featureFacets: {},
      onChangeCmrFacet: expect.any(Function),
      onChangeFeatureFacet: expect.any(Function),
      onTriggerViewAllFacets: expect.any(Function)
    }, {})
  })
})
