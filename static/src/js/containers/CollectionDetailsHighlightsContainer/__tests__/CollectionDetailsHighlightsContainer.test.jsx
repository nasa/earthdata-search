import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  CollectionDetailsHighlightsContainer,
  mapDispatchToProps
} from '../CollectionDetailsHighlightsContainer'
import CollectionDetailsHighlights from '../../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'

jest.mock('../../../components/CollectionDetailsHighlights/CollectionDetailsHighlights', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: CollectionDetailsHighlightsContainer,
  defaultProps: {
    onToggleRelatedUrlsModal: jest.fn()
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

describe('CollectionDetailsHighlightsContainer component', () => {
  test('passes its props and renders a single CollectionDetailsHighlights component', () => {
    setup()

    expect(CollectionDetailsHighlights).toHaveBeenCalledTimes(1)
    expect(CollectionDetailsHighlights).toHaveBeenCalledWith({
      onToggleRelatedUrlsModal: expect.any(Function)
    }, {})
  })
})
