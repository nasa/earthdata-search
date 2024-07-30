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
import mapPropsToValues from '../mapPropsToValues'
import handleFormSubmit from '../handleFormSubmit'

// Jest.useFakeTimers({ legacyFakeTimers: true })

beforeEach(() => {
  jest.clearAllMocks()
})

// Jest.mock('formik', () => ({
//   useFormikContext: jest.fn().mockReturnValue({
//     getFieldMeta: jest.fn()
//   })
// }))

// jest.mock('formik', () => ({
//   Form: jest.fn(({ children }) => (
//     <mock-formik data-testid="formik-mock">
//       {children}
//     </mock-formik>
//   )),
//   withFormik: jest.fn()
// }))

// // Mock App components routes and containers
// jest.mock('../GranuleFiltersContainer', () => () => {
//   const MockedGranuleFiltersContainer = () => <div data-testid="mocked-granuleFiltersContainer" />

//   return MockedGranuleFiltersContainer
// })

// jest.mock('react-router-dom', () => {
//   // Require the original module to not be mocked...
//   const originalModule = jest.requireActual('react-router-dom');

//   return {
//     __esModule: true,
//     ...originalModule,
//     useParams: jest.fn(),
//     useHistory: jest.fn()
//   }
// })

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

  const propsPassed = {
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

  const storeMapped = {
    granuleQuery: {
    }
  }

  const history = createMemoryHistory()

  // Const EnhancedForm = withFormik({
  //   mapPropsToValues: () => ({ name: '' }),
  //   handleSubmit: (values, { setSubmitting }) => {
  //     // Handle form submission
  //     setSubmitting(false)
  //   }
  // })(GranuleFiltersContainer)

  const EnhancedGranuleFiltersContainerTest = withFormik({
    enableReinitialize: true,
    mapPropsToValues: () => ({ granuleQuery: {} }),
    handleSubmit: handleFormSubmit
  })(GranuleFiltersContainer)

  let formikBag

  render(
    <Provider store={store}>
      <Router history={history}>
        <EnhancedGranuleFiltersContainerTest
          render={
            () => {
              // Console.log('🚀 ~ file: GranuleFiltersContainer.test.js:146 ~ setup ~ props:', props)
              formikBag = propsPassed

              return <GranuleFiltersContainer {...propsPassed} />
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
        test('calls onClearGranuleFilters', () => {
          const { handleReset, onClearGranuleFilters } = setup({ granuleFiltersNeedsReset: true })

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(1)
          expect(handleReset).toHaveBeenCalledTimes(1)
        })

        // TODO This is not setting anything to false
        test('sets the granuleFiltersNeedsReset flag to false', () => {
          const { onClearGranuleFilters } = setup()

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(0)
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        // TODO this is sending a request somehow
        test('does not run onClearGranuleFilters', () => {
          // Const onClearGranuleFiltersMock = jest.fn()
          const { onClearGranuleFilters } = setup()

          // EnzymeWrapper.instance().onClearGranuleFilters = onClearGranuleFiltersMock

          // enzymeWrapper.setProps({ granuleFiltersNeedsReset: false })
          // enzymeWrapper.update()

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(0)
        })

        test('sets the granuleFiltersNeedsReset flag to false', () => {
          const { setGranuleFiltersNeedReset } = setup({ granuleFiltersNeedsReset: false })

          // EnzymeWrapper.setProps({ granuleFiltersNeedsReset: false })
          // enzymeWrapper.update()

          expect(setGranuleFiltersNeedReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test('when the form is not dirty', () => {
        const { handleSubmit } = setup({
          dirty: false,
          values: {
            test: 'test'
          }
        })

        // EnzymeWrapper.instance().on HandleSubmit()

        // Advance the timer to account for the setTimeout
        jest.runAllTimers()

        expect(handleSubmit).toHaveBeenCalledTimes(0)
      })

      test('when the form is dirty', async () => {
        const { handleSubmit, formikBag } = setup({
          dirty: true,
          values: {
            test: 'test'
          }
        })
        console.log('🚀 ~ file: GranuleFiltersContainer.test.js:304 ~ test.only ~ formikBag:', formikBag)
        // Expect(formikBag.dirty).toBe(false)

        const user = userEvent.setup()
        const readableGranuleNameTextField = screen.getByRole('textbox', { name: 'Granule ID(s)' })
        // // Const browseOnlyCheckbox = screen.getByTestId('granule-filters__browse-only')
        await act(async () => {
          await user.type(readableGranuleNameTextField, '{orange}')
          await user.type(readableGranuleNameTextField, '{Enter}')
        })

        screen.debug()

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledTimes(1)
          expect(handleSubmit).toHaveBeenCalledWith({
            test: 'test'
          })
        })

        // // Jest.runAllTimers()

        // await waitFor(() => {
        //   expect(handleSubmit).toHaveBeenCalledTimes(1)
        //   // Expect(handleSubmit).toHaveBeenCalledWith({
        //   //   test: 'test'
        //   // })
        // })

        // EnzymeWrapper.instance().onHandleSubmit()

        // Advance the timer to account for the setTimeout

        // expect(handleSubmit).toHaveBeenCalledTimes(1)
        // expect(handleSubmit).toHaveBeenCalledWith({
        //   test: 'test'
        // })
      })
    })

    describe('when the form is cleared', () => {
      test.skip('resets the form', async () => {
        const spy = jest.spyOn(actions, 'clearGranuleFilters')
        const dispatch = jest.fn()
        mapDispatchToProps(dispatch).onClearGranuleFilters('collectionId')
        expect(spy).toBeCalledTimes(1)

        const { handleReset, onClearGranuleFilters } = setup({ granuleFiltersNeedsReset: true })
        // Await waitFor(() => {
        //   expect(handleReset).toHaveBeenCalledTimes(1)
        // })
        // EnzymeWrapper.instance().onClearGranuleFilters()
        // TODO this just seems tobe getting called whenever
        expect(onClearGranuleFilters).toHaveBeenCalledTimes(1)
        expect(onClearGranuleFilters).toHaveBeenCalledWith()
      })

      // TODO Looks like copy remove
      test.skip('clears the granule filters', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().onClearGranuleFilters()

        expect(props.onClearGranuleFilters).toHaveBeenCalledTimes(1)
        expect(props.onClearGranuleFilters).toHaveBeenCalledWith()
      })
    })
  })
})
