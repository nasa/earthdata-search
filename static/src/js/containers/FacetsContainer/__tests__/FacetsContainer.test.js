import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { render, screen } from '@testing-library/react'

import Providers from '../../../providers/Providers/Providers'
import Facets from '../../../components/Facets/Facets'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  FacetsContainer
} from '../FacetsContainer'

Enzyme.configure({ adapter: new Adapter() })

const mockOnChangeCmrFacet = jest.fn()
const mockOnChangeFeatureFacet = jest.fn()
const mockOnTriggerViewAllFacets = jest.fn()

jest.mock('../../../components/Facets/Facets', () => jest.fn(() => <div>Facets</div>))

function setup() {
  const props = {
    facetsById: {},
    featureFacets: {},
    portal: {},
    onChangeCmrFacet: mockOnChangeCmrFacet,
    onChangeFeatureFacet: mockOnChangeFeatureFacet,
    onTriggerViewAllFacets: mockOnTriggerViewAllFacets
  }

  const { container } = render(
    <Providers>
      <FacetsContainer {...props} />
    </Providers>
  )

  return {
    container,
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
      facetsById: {},
      featureFacets: {},
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FacetsContainer component', () => {
  test('Renders the facets component with the correct the props', async () => {
    setup()

    expect(await screen.findByText('Facets')).toBeInTheDocument()
    expect(Facets).toHaveBeenCalledTimes(1)
    expect(Facets).toHaveBeenCalledWith(
      expect.objectContaining({
        facetsById: {},
        featureFacets: {},
        portal: {},
        onChangeCmrFacet: mockOnChangeCmrFacet,
        onChangeFeatureFacet: mockOnChangeFeatureFacet,
        onTriggerViewAllFacets: mockOnTriggerViewAllFacets,
        openKeywordFacet: false
        // TODO: Check if theres a better way to test this
        // setOpenKeywordFacet: expect.any(Function)
      }),
      {}
    )
  })
})
