import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Facets from '../../../components/Facets/Facets'

import { mapStateToProps, FacetsContainer } from '../FacetsContainer'

jest.mock('../../../components/Facets/Facets', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: FacetsContainer,
  defaultProps: {
    facetsById: {}
  }
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      searchResults: {
        facets: {
          byId: {}
        }
      }
    }

    const expectedState = {
      facetsById: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FacetsContainer component', () => {
  test('Renders the facets component with the correct the props', async () => {
    setup()

    expect(Facets).toHaveBeenCalledTimes(1)
    expect(Facets).toHaveBeenCalledWith({
      facetsById: {}
    }, {})
  })
})
