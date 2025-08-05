import React from 'react'

// @ts-expect-error The file does not have types
import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  OverrideTemporalModalContainer
} from '../OverrideTemporalModalContainer'

import OverrideTemporalModal from '../../../components/OverrideTemporalModal/OverrideTemporalModal'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/OverrideTemporalModal/OverrideTemporalModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OverrideTemporalModalContainer,
  defaultProps: {
    isOpen: true,
    onToggleOverrideTemporalModal: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleOverrideTemporalModal calls actions.toggleOverrideTemporalModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleOverrideTemporalModal')

    mapDispatchToProps(dispatch).onToggleOverrideTemporalModal(false)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(false)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      ui: {
        overrideTemporalModal: {
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

describe('OverrideTemporalModalContainer component', () => {
  test('passes its props and renders a single OverrideTemporalModal component', () => {
    setup()

    expect(OverrideTemporalModal).toHaveBeenCalledTimes(1)
    expect(OverrideTemporalModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isOpen: true,
        onToggleOverrideTemporalModal: expect.any(Function)
      }),
      {}
    )
  })
})
