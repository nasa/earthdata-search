import React from 'react'
import { render } from '@testing-library/react'

// @ts-expect-error The file does not have types
import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  OverrideTemporalModalContainer
} from '../OverrideTemporalModalContainer'

import OverrideTemporalModal from '../../../components/OverrideTemporalModal/OverrideTemporalModal'

jest.mock('../../../components/OverrideTemporalModal/OverrideTemporalModal', () => jest.fn(() => <div />))

const setup = () => {
  const props = {
    isOpen: true,
    temporalSearch: {},
    onChangeProjectQuery: jest.fn(),
    onToggleOverrideTemporalModal: jest.fn()
  }

  render(<OverrideTemporalModalContainer {...props} />)

  return {
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangeProjectQuery calls actions.changeProjectQuery', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeProjectQuery')

    mapDispatchToProps(dispatch).onChangeProjectQuery({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })

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
      query: {
        collection: {
          temporal: {}
        }
      },
      ui: {
        overrideTemporalModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false,
      temporalSearch: {}
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
        temporalSearch: {},
        onChangeQuery: expect.any(Function),
        onToggleOverrideTemporalModal: expect.any(Function)
      }),
      {}
    )
  })
})
