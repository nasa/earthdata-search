import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import {
  AdvancedSearchModalContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdvancedSearchModalContainer'
import AdvancedSearchModal from '../../../components/AdvancedSearchModal/AdvancedSearchModal'

jest.mock('../../../components/AdvancedSearchModal/AdvancedSearchModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdvancedSearchModalContainer,
  defaultProps: {
    isOpen: true,
    isValid: true,
    errors: {},
    fields: [],
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    regionSearchResults: {
      byId: {},
      allIds: []
    },
    resetForm: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn()
  }
})

describe('mapDispatchToProps', () => {
  test('onToggleAdvancedSearchModal calls actions.toggleAdvancedSearchModal', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'toggleAdvancedSearchModal')

    mapDispatchToProps(dispatch).onToggleAdvancedSearchModal({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      searchResults: {
        regions: {}
      },
      ui: {
        advancedSearchModal: {
          isOpen: false
        }
      }
    }

    const expectedState = {
      isOpen: false,
      regionSearchResults: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdvancedSearchModalContainer component', () => {
  test('passes its props and renders a single FacetsModal component', () => {
    setup()

    expect(AdvancedSearchModal).toHaveBeenCalledTimes(1)
    expect(AdvancedSearchModal).toHaveBeenCalledWith({
      errors: {},
      fields: [],
      handleBlur: expect.any(Function),
      handleChange: expect.any(Function),
      handleSubmit: expect.any(Function),
      isOpen: true,
      isValid: true,
      onToggleAdvancedSearchModal: expect.any(Function),
      regionSearchResults: {
        allIds: [],
        byId: {}
      },
      resetForm: expect.any(Function),
      setFieldTouched: expect.any(Function),
      setFieldValue: expect.any(Function),
      touched: {},
      validateForm: expect.any(Function),
      values: {}
    }, {})
  })
})
