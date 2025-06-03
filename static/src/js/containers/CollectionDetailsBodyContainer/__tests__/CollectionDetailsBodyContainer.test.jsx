import React from 'react'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  CollectionDetailsBodyContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../CollectionDetailsBodyContainer'
import CollectionDetailsBody from '../../../components/CollectionDetails/CollectionDetailsBody'

jest.mock('../../../components/CollectionDetails/CollectionDetailsBody', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionDetailsBodyContainer,
  defaultProps: {
    collectionMetadata: {
      test: 'metadata'
    },
    isActive: true,
    onToggleRelatedUrlsModal: jest.fn(),
    onMetricsRelatedCollection: jest.fn(),
    onFocusedCollectionChange: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleRelatedUrlsModal calls actions.toggleRelatedUrlsModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleRelatedUrlsModal')

    mapDispatchToProps(dispatch).onToggleRelatedUrlsModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId'
    }

    const expectedState = {
      collectionMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('CollectionDetailsBodyContainer component', () => {
  test('passes its props and renders a single CollectionDetailsBody component', async () => {
    setup()

    // CollectionDetailsBody is lazy loaded, and shows up under that element
    await waitFor(() => {
      expect(CollectionDetailsBody).toHaveBeenCalledTimes(1)
    })

    expect(CollectionDetailsBody).toHaveBeenCalledWith({
      collectionMetadata: {
        test: 'metadata'
      },
      isActive: true,
      onToggleRelatedUrlsModal: expect.any(Function),
      onMetricsRelatedCollection: expect.any(Function),
      onFocusedCollectionChange: expect.any(Function)
    }, {})
  })
})
