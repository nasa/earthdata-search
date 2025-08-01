import React from 'react'
import { withFormik } from 'formik'
import { act, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import RegionSearchForm from '../RegionSearchForm'
import RegionSearch from '../RegionSearch'

jest.mock('../RegionSearchForm', () => jest.fn(() => <div />))

const Wrapper = withFormik({
  enableReinitialize: true,
  mapPropsToErrors: (props) => props.errors,
  mapPropsToValues: (props) => props.values,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values)
  }
})(RegionSearch)

const setup = setupTest({
  Component: Wrapper,
  defaultProps: {
    field: {
      name: 'regionSearch',
      type: 'regionSearch',
      label: 'Search by Feature',
      resolve: jest.fn(),
      fields: [
        {
          name: 'endpoint',
          value: 'region'
        },
        {
          name: 'keyword'
        },
        {
          name: 'exact',
          value: false
        },
        {
          name: 'selectedRegion'
        }
      ]
    },
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    onChangeRegionQuery: jest.fn(),
    regionSearchResults: {},
    setFieldValue: jest.fn(),
    setModalOverlay: jest.fn(),
    touched: {},
    values: {},
    validateForm: jest.fn()
  },
  defaultZustandState: {
    query: {
      changeRegionQuery: jest.fn()
    }
  }
})

describe('RegionSearch component', () => {
  test('should render the RegionSearchForm', () => {
    setup()

    expect(RegionSearchForm).toHaveBeenCalledTimes(2)
    expect(RegionSearchForm).toHaveBeenCalledWith({
      onRemoveSelected: expect.any(Function),
      regionSearchForm: {
        dirty: false,
        errors: {},
        getFieldHelpers: expect.any(Function),
        getFieldMeta: expect.any(Function),
        getFieldProps: expect.any(Function),
        handleBlur: expect.any(Function),
        handleChange: expect.any(Function),
        handleReset: expect.any(Function),
        handleSubmit: expect.any(Function),
        initialErrors: {},
        initialStatus: undefined,
        initialTouched: {},
        initialValues: {
          endpoint: 'region'
        },
        isSubmitting: false,
        isValid: true,
        isValidating: false,
        registerField: expect.any(Function),
        resetForm: expect.any(Function),
        setErrors: expect.any(Function),
        setFieldError: expect.any(Function),
        setFieldTouched: expect.any(Function),
        setFieldValue: expect.any(Function),
        setFormikState: expect.any(Function),
        setStatus: expect.any(Function),
        setSubmitting: expect.any(Function),
        setTouched: expect.any(Function),
        setValues: expect.any(Function),
        status: undefined,
        submitCount: 0,
        submitForm: expect.any(Function),
        touched: {},
        unregisterField: expect.any(Function),
        validateField: expect.any(Function),
        validateForm: expect.any(Function),
        validateOnBlur: true,
        validateOnChange: true,
        validateOnMount: false,
        values: {
          endpoint: 'region'
        }
      },
      selectedRegion: undefined
    }, {})
  })

  // Describe('the form', () => {
  //   test('onSumbit should call onSearchSubmit', () => {
  //     const onSubmitMock = jest.fn()

  //     const { enzymeWrapper } = setup()

  //     enzymeWrapper.instance().onSearchSubmit = onSubmitMock
  //     enzymeWrapper.find(Formik).prop('onSubmit')({
  //       test: 'test'
  //     })

  //     expect(onSubmitMock).toHaveBeenCalledTimes(1)
  //     expect(onSubmitMock).toHaveBeenCalledWith({
  //       test: 'test'
  //     })
  //   })
  // })

  describe('when submitting the form', () => {
    test('calls changeRegionQuery and setModalOverlay', async () => {
      const { props, zustandState } = setup({
        overrideProps: {
          values: {
            regionSearch: {
              keyword: 'Test',
              endpoint: 'region',
              exact: true
            }
          }
        }
      })

      act(() => {
        RegionSearchForm.mock.calls[0][0].regionSearchForm.handleSubmit()
      })

      await waitFor(() => {
        expect(zustandState.query.changeRegionQuery).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.query.changeRegionQuery).toHaveBeenCalledWith({
        keyword: 'Test',
        endpoint: 'region',
        exact: true
      })

      expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      expect(props.setModalOverlay).toHaveBeenCalledWith('regionSearchResults')
    })
  })

  describe('onRemoveSelected', () => {
    test('calls setModalOverlay', async () => {
      const { props } = setup({
        overrideProps: {
          values: {
            regionSearch: {
              keyword: 'Test',
              endpoint: 'region',
              exact: true
            }
          }
        }
      })

      act(() => {
        RegionSearchForm.mock.calls[0][0].onRemoveSelected()
      })

      await waitFor(() => {
        expect(props.setModalOverlay).toHaveBeenCalledTimes(1)
      })

      expect(props.setModalOverlay).toHaveBeenCalledWith(null)
    })
  })
})
