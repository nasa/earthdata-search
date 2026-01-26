import React from 'react'
import { withFormik } from 'formik'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdvancedSearchForm from '../AdvancedSearchForm'
import RegionSearch from '../RegionSearch'

vi.mock('../RegionSearch', () => ({ default: vi.fn(() => <div />) }))

const Wrapper = withFormik({
  enableReinitialize: true,
  mapPropsToErrors: (props) => props.errors,
  mapPropsToValues: (props) => props.values,
  handleSubmit: (values, { props }) => {
    props.onSubmit(values)
  }
})(AdvancedSearchForm)

const setup = setupTest({
  Component: Wrapper,
  defaultProps: {
    errors: {},
    fields: [],
    handleBlur: vi.fn(),
    handleChange: vi.fn(),
    handleSearch: vi.fn(),
    setFieldValue: vi.fn(),
    setModalOverlay: vi.fn(),
    touched: {},
    validateForm: vi.fn(),
    values: {}
  }
})

describe('AdvancedSearchForm component', () => {
  describe('when provided fields', () => {
    describe('when provided an input', () => {
      test('should render an input', async () => {
        setup({
          overrideProps: {
            fields: [
              {
                name: 'testInput',
                type: 'input',
                label: 'Test Input',
                description: 'This is a test description',
                text: 'This is some text'
              }
            ]
          }
        })

        await waitFor(() => {
          expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
        })
      })

      describe('when provided an error', () => {
        test('should render an error', async () => {
          setup({
            overrideProps: {
              errors: {
                testInput: 'This is an error'
              },
              fields: [
                {
                  name: 'testInput',
                  type: 'input'
                }
              ]
            }
          })

          await waitFor(() => {
            expect(screen.getByText('This is an error')).toBeInTheDocument()
          })
        })
      })
    })

    describe('when provided a regionSearch', () => {
      test('should render the RegionSearch component', async () => {
        setup({
          overrideProps: {
            fields: [
              {
                name: 'regionSearch',
                type: 'regionSearch',
                label: 'Search by Feature',
                fields: []
              }
            ]
          }
        })

        await waitFor(() => {
          expect(RegionSearch).toHaveBeenCalledTimes(3)
        })

        expect(RegionSearch).toHaveBeenCalledWith({
          errors: {},
          field: {
            fields: [],
            label: 'Search by Feature',
            name: 'regionSearch',
            type: 'regionSearch'
          },
          handleBlur: expect.any(Function),
          handleChange: expect.any(Function),
          handleSearch: expect.any(Function),
          setFieldValue: expect.any(Function),
          setModalOverlay: expect.any(Function),
          touched: {},
          values: {}
        }, {})
      })
    })
  })
})
