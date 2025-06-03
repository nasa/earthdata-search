import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  ChunkedOrderModalContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../ChunkedOrderModalContainer'
import ChunkedOrderModal from '../../../components/ChunkedOrderModal/ChunkedOrderModal'

jest.mock('../../../components/ChunkedOrderModal/ChunkedOrderModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ChunkedOrderModalContainer,
  defaultProps: {
    projectCollectionsMetadata: {},
    projectCollectionsRequiringChunking: {},
    isOpen: true,
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleChunkedOrderModal calls actions.toggleChunkedOrderModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleChunkedOrderModal')

    mapDispatchToProps(dispatch).onToggleChunkedOrderModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })

  test('onSubmitRetrieval calls actions.submitRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'submitRetrieval')

    mapDispatchToProps(dispatch).onSubmitRetrieval()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith()
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        chunkedOrderModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false,
      projectCollectionsMetadata: {},
      projectCollectionsRequiringChunking: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('ChunkedOrderModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    setup()

    expect(ChunkedOrderModal).toHaveBeenCalledTimes(1)
    expect(ChunkedOrderModal).toHaveBeenCalledWith({
      isOpen: true,
      onSubmitRetrieval: expect.any(Function),
      onToggleChunkedOrderModal: expect.any(Function),
      projectCollectionsMetadata: {},
      projectCollectionsRequiringChunking: {}
    }, {})
  })
})
