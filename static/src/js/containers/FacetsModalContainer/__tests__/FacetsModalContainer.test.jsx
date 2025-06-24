import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  FacetsModalContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../FacetsModalContainer'
import FacetsModal from '../../../components/Facets/FacetsModal'

jest.mock('../../../components/Facets/FacetsModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: FacetsModalContainer,
  defaultProps: {
    collectionHits: 1,
    isOpen: true,
    onApplyViewAllFacets: jest.fn(),
    onChangeViewAllFacet: jest.fn(),
    onToggleFacetsModal: jest.fn(),
    viewAllFacets: { value: 'viewAllFacets' }
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleFacetsModal calls actions.toggleFacetsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleFacetsModal')

    mapDispatchToProps(dispatch).onToggleFacetsModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
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
    setup()

    expect(FacetsModal).toHaveBeenCalledTimes(1)
    expect(FacetsModal).toHaveBeenCalledWith({
      collectionHits: 1,
      isOpen: true,
      onToggleFacetsModal: expect.any(Function),
      viewAllFacets: { value: 'viewAllFacets' }
    }, {})
  })
})
