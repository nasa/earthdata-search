import React from 'react'
import { render, screen } from '@testing-library/react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import configureStore from '../../../store/configureStore'

import actions from '../../../actions'
import * as metrics from '../../../middleware/metrics/actions'

import {
  act,
  render,
  waitFor,
  screen
} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'


import EnhancedGranuleFiltersContainer, {
  mapDispatchToProps,
  mapStateToProps
} from '../GranuleFiltersContainer'

import '@testing-library/jest-dom'

jest.useFakeTimers({ legacyFakeTimers: true })

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

  // const user = userEvent.setup()

  const store = configureStore()

  const history = createMemoryHistory()

  render(
    <Provider store={store}>
      <Router history={history}>
        <EnhancedGranuleFiltersContainer {...props} />
      </Router>
    </Provider>
  )

  return {
    onClearGranuleFilters,
    handleSubmit,
    handleReset
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
  test.only('renders itself correctly', () => {
    setup()
    expect(screen.getByRole('heading', { name: 'Granule Search' })).toBeInTheDocument()
  })

  describe('GranuleFiltersForm', () => {
    describe('when the component is updated', () => {
      describe('when the granuleFiltersNeedsReset flag is set to true', () => {
        test('calls onClearGranuleFilters', () => {
          const { onClearGranuleFilters } = setup({ granuleFiltersNeedsReset: true })

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(1)
        })

        test.only('sets the granuleFiltersNeedsReset flag to false', () => {
          const { onClearGranuleFilters } = setup()

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(0)
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        // TODO this is sending a request somehow
        test.only('does not run onClearGranuleFilters', () => {
          // Const onClearGranuleFiltersMock = jest.fn()
          const { onClearGranuleFilters } = setup()

          // EnzymeWrapper.instance().onClearGranuleFilters = onClearGranuleFiltersMock

          // enzymeWrapper.setProps({ granuleFiltersNeedsReset: false })
          // enzymeWrapper.update()

          expect(onClearGranuleFilters).toHaveBeenCalledTimes(0)
        })

        test('sets the granuleFiltersNeedsReset flag to false', () => {
          const { enzymeWrapper, props } = setup()

          enzymeWrapper.setProps({ granuleFiltersNeedsReset: false })
          enzymeWrapper.update()

          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test.only('when the form is not dirty', () => {
        const { handleSubmit } = setup({
          dirty: false,
          values: {
            test: 'test'
          }
        })

        // enzymeWrapper.instance().on HandleSubmit()
 
        // Advance the timer to account for the setTimeout
        jest.runAllTimers()

        expect(handleSubmit).toHaveBeenCalledTimes(0)
      })

      test('when the form is dirty', () => {
        const { enzymeWrapper, props } = setup({
          dirty: true,
          values: {
            test: 'test'
          }
        })

        enzymeWrapper.instance().onHandleSubmit()

        // Advance the timer to account for the setTimeout
        jest.runAllTimers()

        expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        expect(props.handleSubmit).toHaveBeenCalledWith({
          test: 'test'
        })
      })
    })

    describe('when the form is cleared', () => {
      test.only('resets the form', () => {
        const { handleReset } = setup()
        screen.debug()

        // enzymeWrapper.instance().onClearGranuleFilters()

        // expect(props.handleReset).toHaveBeenCalledTimes(1)
      })

      test('clears the granule filters', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().onClearGranuleFilters()

        expect(props.onClearGranuleFilters).toHaveBeenCalledTimes(1)
        expect(props.onClearGranuleFilters).toHaveBeenCalledWith()
      })
    })
  })
})
