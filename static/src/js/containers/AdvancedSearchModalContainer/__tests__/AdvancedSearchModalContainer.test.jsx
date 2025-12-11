import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { AdvancedSearchModalContainer } from '../AdvancedSearchModalContainer'
import AdvancedSearchModal from '../../../components/AdvancedSearchModal/AdvancedSearchModal'

jest.mock('../../../components/AdvancedSearchModal/AdvancedSearchModal', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdvancedSearchModalContainer,
  defaultProps: {
    isValid: true,
    errors: {},
    fields: [],
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    resetForm: jest.fn(),
    setFieldValue: jest.fn(),
    setFieldTouched: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn()
  }
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
      isValid: true,
      resetForm: expect.any(Function),
      setFieldTouched: expect.any(Function),
      setFieldValue: expect.any(Function),
      touched: {},
      validateForm: expect.any(Function),
      values: {}
    }, {})
  })
})
