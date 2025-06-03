import { withFormik } from 'formik'

import {
  act,
  screen,
  waitFor
} from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import * as metrics from '../../../middleware/metrics/actions'

import {
  GranuleFiltersContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../GranuleFiltersContainer'

import validationSchema from '../validationSchema'
import handleFormSubmit from '../handleFormSubmit'

jest.mock('../handleFormSubmit')

const EnhancedGranuleFiltersContainer = withFormik({
  enableReinitialize: true,
  validationSchema,
  mapPropsToValues: () => ({ granuleQuery: {} }),
  handleSubmit: handleFormSubmit
})(GranuleFiltersContainer)

const handleReset = jest.fn()
const handleSubmit = jest.fn()

const setup = setupTest({
  Component: EnhancedGranuleFiltersContainer,
  defaultProps: {
    cmrFacetParams: {},
    collectionMetadata: {
      title: 'Test Collection'
    },
    collectionQuery: {},
    dirty: false,
    granuleFiltersNeedsReset: false,
    granuleQuery: {
      excludedGranuleIds: []
    },
    errors: {},
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleReset,
    handleSubmit,
    isValid: true,
    onApplyGranuleFilters: jest.fn(),
    onClearGranuleFilters: jest.fn(),
    onMetricsGranuleFilter: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    setGranuleFiltersNeedReset: jest.fn(),
    touched: {},
    values: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onApplyGranuleFilters calls actions.applyGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyGranuleFilters')

    mapDispatchToProps(dispatch).onApplyGranuleFilters({ mock: 'data' }, true)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' }, true)
  })

  test('onClearGranuleFilters calls actions.clearGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearGranuleFilters')

    mapDispatchToProps(dispatch).onClearGranuleFilters('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onUndoExcludeGranule calls actions.undoExcludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'undoExcludeGranule')

    mapDispatchToProps(dispatch).onUndoExcludeGranule('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })

  test('onMetricsGranuleFilter calls metricsGranuleFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metrics, 'metricsGranuleFilter')

    mapDispatchToProps(dispatch).onMetricsGranuleFilter('collectionId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('collectionId')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      metadata: {
        collections: {}
      },
      focusedCollection: 'collectionId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granule: {}
            }
          },
          temporal: {}
        }
      }
    }

    const expectedState = {
      collectionMetadata: {},
      granuleQuery: {},
      temporal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleFiltersContainer component', () => {
  test('renders itself correctly', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Granule Search' })).toBeInTheDocument()
  })

  describe('GranuleFiltersForm', () => {
    describe('when the component is updated', () => {
      describe('when the granuleFiltersNeedsReset flag is set to true', () => {
        test('calls onClearGranuleFilters and setGranuleFiltersNeedReset', () => {
          const { props } = setup({
            overrideProps: {
              granuleFiltersNeedsReset: true
            }
          })

          expect(props.onClearGranuleFilters).toHaveBeenCalledTimes(1)
          expect(props.onClearGranuleFilters).toHaveBeenCalledWith()

          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledTimes(1)
          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledWith(false)
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        test('does not run onClearGranuleFilters or setGranuleFiltersNeedReset', () => {
          const { props } = setup()

          expect(props.onClearGranuleFilters).toHaveBeenCalledTimes(0)

          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test('handle submit is called', async () => {
        const { user } = setup({
          overrideProps: {
            values: {
              test: 'test'
            }
          }
        })

        const readableGranuleNameTextField = screen.getByRole('textbox', { name: 'Granule ID(s)' })

        await act(async () => {
          await user.type(readableGranuleNameTextField, '{testGranuleName}')
          await user.type(readableGranuleNameTextField, '{Enter}')
        })

        await waitFor(() => {
          expect(handleFormSubmit).toHaveBeenCalledTimes(1)
        })

        expect(handleFormSubmit).toHaveBeenCalledWith({ granuleQuery: {} }, {
          props: {
            cmrFacetParams: {},
            collectionMetadata: { title: 'Test Collection' },
            collectionQuery: {},
            dirty: false,
            errors: {},
            granuleFiltersNeedsReset: false,
            granuleQuery: { excludedGranuleIds: [] },
            handleBlur: expect.any(Function),
            handleChange: expect.any(Function),
            handleReset: expect.any(Function),
            handleSubmit: expect.any(Function),
            isValid: true,
            onApplyGranuleFilters: expect.any(Function),
            onClearGranuleFilters: expect.any(Function),
            onMetricsGranuleFilter: expect.any(Function),
            onUndoExcludeGranule: expect.any(Function),
            setFieldTouched: expect.any(Function),
            setFieldValue: expect.any(Function),
            setGranuleFiltersNeedReset: expect.any(Function),
            touched: {},
            values: { test: 'test' }
          },
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
          submitForm: expect.any(Function),
          validateField: expect.any(Function),
          validateForm: expect.any(Function)
        })
      })
    })

    describe('when hovering over the readable granule name field', () => {
      test('displays tool-tip information', async () => {
        const { user } = setup({
          overrideProps: {
            values: {
              test: 'test'
            }
          }
        })

        const tooltipText = /Filter granules by using a granule ID/i

        expect(screen.queryByText(tooltipText)).not.toBeInTheDocument()
        const readableGranuleNameTMoreInfo = screen.getByRole('img', { name: 'A question mark in a circle' })

        // Only show tool-tip on hover
        await act(async () => {
          await user.hover(readableGranuleNameTMoreInfo)
        })

        // Ensure Tooltip sections are rendering
        expect(screen.getByText(/Asterisks/i)).toBeVisible()
        expect(screen.getByText(/Question marks/i)).toBeVisible()
        expect(screen.getByText(/Commas/i)).toBeVisible()
      })
    })
  })
})
