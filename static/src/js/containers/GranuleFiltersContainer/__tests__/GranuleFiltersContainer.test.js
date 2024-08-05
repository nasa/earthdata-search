import React from 'react'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { withFormik } from 'formik'

import {
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureStore from '../../../store/configureStore'

import actions from '../../../actions'
import * as metrics from '../../../middleware/metrics/actions'

import {
  GranuleFiltersContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../GranuleFiltersContainer'

import validationSchema from '../validationSchema'
import handleFormSubmit from '../handleFormSubmit'

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrideProps) => {
  const onApplyGranuleFilters = jest.fn()
  const onUndoExcludeGranule = jest.fn()
  const setFieldTouched = jest.fn()
  const setFieldValue = jest.fn()
  const setGranuleFiltersNeedReset = jest.fn()
  const handleBlur = jest.fn()
  const handleChange = jest.fn()
  const handleReset = jest.fn()
  const handleSubmit = jest.fn()
  const onClearGranuleFilters = jest.fn()
  const onMetricsGranuleFilter = jest.fn()

  const props = {
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
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
    isValid: true,
    onApplyGranuleFilters,
    onClearGranuleFilters,
    onMetricsGranuleFilter,
    onUndoExcludeGranule,
    setFieldTouched,
    setFieldValue,
    setGranuleFiltersNeedReset,
    touched: {},
    values: {},
    ...overrideProps

  }

  const user = userEvent.setup()

  const store = configureStore()

  const history = createMemoryHistory()

  // `Formik` wrapper mock around component to set context
  // `Validation schema` and `handleSubmit` are not needed for mock but, used here for better mock to the real component
  const EnhancedGranuleFiltersContainer = withFormik({
    enableReinitialize: true,
    validationSchema,
    mapPropsToValues: () => ({ granuleQuery: {} }),
    handleSubmit: handleFormSubmit
  })(GranuleFiltersContainer)

  // `formikBag` is the internal state of formik which we are manually going to override to match our passed props
  let formikBag
  // TODO update with the new way `formik` wants us to render these inline without `render` prop
  render(
    <Provider store={store}>
      <Router history={history}>
        <EnhancedGranuleFiltersContainer
          render={
            () => {
              formikBag = props

              return <GranuleFiltersContainer {...props} />
            }
          }
        />
      </Router>
    </Provider>
  )

  return {
    onClearGranuleFilters,
    handleSubmit,
    handleReset,
    setGranuleFiltersNeedReset,
    user,
    formikBag
  }
}

describe('mapDispatchToProps', () => {
  test('onApplyGranuleFilters calls actions.applyGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'applyGranuleFilters')

    mapDispatchToProps(dispatch).onApplyGranuleFilters({ mock: 'data' }, true)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' }, true)
  })

  test('onClearGranuleFilters calls actions.clearGranuleFilters', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'clearGranuleFilters')

    mapDispatchToProps(dispatch).onClearGranuleFilters('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onUndoExcludeGranule calls actions.undoExcludeGranule', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'undoExcludeGranule')

    mapDispatchToProps(dispatch).onUndoExcludeGranule('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
  })

  test('onMetricsGranuleFilter calls metricsGranuleFilter', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metrics, 'metricsGranuleFilter')

    mapDispatchToProps(dispatch).onMetricsGranuleFilter('collectionId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('collectionId')
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
        test('calls onClearGranuleFilters ', () => {
          const { onClearGranuleFilters } = setup({ granuleFiltersNeedsReset: true })

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(1)
        })

        test('calls handleReset ', () => {
          const { handleReset } = setup({ granuleFiltersNeedsReset: true })

          expect(handleReset).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        test('does not run onClearGranuleFilters', () => {
          const { onClearGranuleFilters } = setup()
          expect(onClearGranuleFilters).toHaveBeenCalledTimes(0)
        })

        test('sets the granuleFiltersNeedsReset flag to false', () => {
          const { setGranuleFiltersNeedReset } = setup({ granuleFiltersNeedsReset: false })
          expect(setGranuleFiltersNeedReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test('handle submit is called', async () => {
        const { handleSubmit } = setup({
          values: {
            test: 'test'
          }
        })

        const user = userEvent.setup()
        const readableGranuleNameTextField = screen.getByRole('textbox', { name: 'Granule ID(s)' })

        await act(async () => {
          await user.type(readableGranuleNameTextField, '{testGranuleName}')
          await user.type(readableGranuleNameTextField, '{Enter}')
        })

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
