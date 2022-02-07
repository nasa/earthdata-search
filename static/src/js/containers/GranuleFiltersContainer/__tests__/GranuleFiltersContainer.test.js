import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, GranuleFiltersContainer } from '../GranuleFiltersContainer'

Enzyme.configure({ adapter: new Adapter() })

jest.useFakeTimers('legacy')

beforeEach(() => {
  jest.clearAllMocks()
})

function setup(overrideProps) {
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
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleReset: jest.fn(),
    handleSubmit: jest.fn(),
    isValid: true,
    onApplyGranuleFilters: jest.fn(),
    onClearGranuleFilters: jest.fn(),
    onUndoExcludeGranule: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    setGranuleFiltersNeedReset: jest.fn(),
    touched: {},
    values: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleFiltersContainer {...props} />)

  return {
    enzymeWrapper,
    props
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
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeDefined()
  })

  describe('GranuleFiltersForm', () => {
    test('renders with the correct body prop and passes the correct props', () => {
      const { enzymeWrapper, props } = setup()

      const granuleFiltersFormProps = enzymeWrapper.props()

      expect(granuleFiltersFormProps.values).toEqual(props.values)
      expect(granuleFiltersFormProps.touched).toEqual(props.touched)
      expect(granuleFiltersFormProps.errors).toEqual(props.errors)
      expect(granuleFiltersFormProps.handleChange).toEqual(props.handleChange)
      expect(granuleFiltersFormProps.handleBlur).toEqual(props.handleBlur)
      expect(granuleFiltersFormProps.setFieldValue).toEqual(props.setFieldValue)
      expect(granuleFiltersFormProps.setFieldTouched).toEqual(props.setFieldTouched)
      expect(granuleFiltersFormProps.portal).toEqual(props.portal)
      expect(granuleFiltersFormProps.excludedGranuleIds)
        .toEqual(props.granuleQuery.excludedGranuleIds)
      expect(granuleFiltersFormProps.onUndoExcludeGranule).toEqual(props.onUndoExcludeGranule)
    })

    describe('when the component is updated', () => {
      describe('when the granuleFiltersNeedsReset flag is set to true', () => {
        test('calls onClearGranuleFilters', () => {
          const onClearGranuleFiltersMock = jest.fn()
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().onClearGranuleFilters = onClearGranuleFiltersMock

          enzymeWrapper.setProps({ granuleFiltersNeedsReset: true })
          enzymeWrapper.update()

          expect(onClearGranuleFiltersMock).toHaveBeenCalledTimes(1)
        })

        test('sets the granuleFiltersNeedsReset flag to false', () => {
          const { enzymeWrapper, props } = setup()

          enzymeWrapper.setProps({ granuleFiltersNeedsReset: true })
          enzymeWrapper.update()

          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledTimes(1)
          expect(props.setGranuleFiltersNeedReset).toHaveBeenCalledWith(false)
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        test('does not run onClearGranuleFilters', () => {
          const onClearGranuleFiltersMock = jest.fn()
          const { enzymeWrapper } = setup()

          enzymeWrapper.instance().onClearGranuleFilters = onClearGranuleFiltersMock

          enzymeWrapper.setProps({ granuleFiltersNeedsReset: false })
          enzymeWrapper.update()

          expect(onClearGranuleFiltersMock).toHaveBeenCalledTimes(0)
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
      test('when the form is not dirty', () => {
        const { enzymeWrapper, props } = setup({
          dirty: false,
          values: {
            test: 'test'
          }
        })

        enzymeWrapper.instance().onHandleSubmit()

        // Advance the timer to account for the setTimeout
        jest.runAllTimers()

        expect(props.handleSubmit).toHaveBeenCalledTimes(0)
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
      test('resets the form', () => {
        const { enzymeWrapper, props } = setup()

        enzymeWrapper.instance().onClearGranuleFilters()

        expect(props.handleReset).toHaveBeenCalledTimes(1)
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
