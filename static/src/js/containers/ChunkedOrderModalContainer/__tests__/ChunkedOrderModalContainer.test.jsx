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
    isOpen: true,
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
      isOpen: false
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
      onToggleChunkedOrderModal: expect.any(Function)
    }, {})
  })
})
