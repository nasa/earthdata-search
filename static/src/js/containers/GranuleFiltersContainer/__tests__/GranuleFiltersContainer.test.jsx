import React from 'react'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import * as metrics from '../../../middleware/metrics/actions'

import {
  GranuleFiltersContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../GranuleFiltersContainer'

import GranuleFiltersForm from '../../../components/GranuleFilters/GranuleFiltersForm'

jest.mock('../../../components/GranuleFilters/GranuleFiltersForm', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: GranuleFiltersContainer,
  defaultProps: {
    collectionMetadata: {
      conceptId: 'collectionId',
      title: 'Test Collection'
    },
    // Dirty: false,
    errors: {},
    granuleFiltersNeedsReset: false,
    handleBlur: jest.fn(),
    handleChange: jest.fn(),
    handleReset: jest.fn(),
    handleSubmit: jest.fn(),
    // IsValid: true,
    onMetricsGranuleFilter: jest.fn(),
    setFieldTouched: jest.fn(),
    setFieldValue: jest.fn(),
    setGranuleFiltersNeedReset: jest.fn(),
    touched: {},
    values: {}
  },
  defaultZustandState: {
    query: {
      changeGranuleQuery: jest.fn()
    }
  },
  withRedux: true,
  withRouter: true
})

describe('mapDispatchToProps', () => {
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
      focusedCollection: 'collectionId'
    }

    const expectedState = {
      collectionMetadata: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('GranuleFiltersContainer component', () => {
  test('renders the GranuleFiltersForm', () => {
    setup()

    expect(GranuleFiltersForm).toHaveBeenCalledTimes(1)
    expect(GranuleFiltersForm).toHaveBeenCalledWith({
      collectionMetadata: {
        conceptId: 'collectionId',
        title: 'Test Collection'
      },
      errors: {},
      handleBlur: expect.any(Function),
      handleChange: expect.any(Function),
      handleSubmit: expect.any(Function),
      onMetricsGranuleFilter: expect.any(Function),
      setFieldTouched: expect.any(Function),
      setFieldValue: expect.any(Function),
      touched: {},
      values: {}
    }, {})
  })

  describe('GranuleFiltersForm', () => {
    describe('when the component is updated', () => {
      describe('when the granuleFiltersNeedsReset flag is set to true', () => {
        test('calls changeGranuleQuery and handleReset', () => {
          const { props, zustandState } = setup({
            overrideProps: {
              granuleFiltersNeedsReset: true
            }
          })

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(1)
          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledWith({
            collectionId: 'collectionId',
            query: {}
          })

          expect(props.handleReset).toHaveBeenCalledTimes(1)
          expect(props.handleReset).toHaveBeenCalledWith()
        })
      })

      describe('when the granuleFiltersNeedsReset flag is set to false', () => {
        test('does not call changeGranuleQuery and handleReset', () => {
          const { props, zustandState } = setup()

          expect(zustandState.query.changeGranuleQuery).toHaveBeenCalledTimes(0)
          expect(props.handleReset).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when the form is submitted', () => {
      test('handle submit is called', async () => {
        const { props } = setup({
          overrideProps: {
            values: {
              mock: 'data'
            }
          }
        })

        GranuleFiltersForm.mock.calls[0][0].handleSubmit()

        await waitFor(() => {
          expect(props.handleSubmit).toHaveBeenCalledTimes(1)
        })

        expect(props.handleSubmit).toHaveBeenCalledWith({
          mock: 'data'
        })
      })
    })
  })
})
