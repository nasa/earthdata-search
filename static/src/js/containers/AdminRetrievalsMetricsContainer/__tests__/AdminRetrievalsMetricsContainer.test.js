import React from 'react'
import { render, screen } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import actions from '../../../actions'
import AdminRetrievalsMetrics from '../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'
import {
  AdminRetrievalsMetricsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalsMetricsContainer'

jest.mock('../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics', () => jest.fn(
  () => <mock-Admin-Retrievals-Metrics>Mock Admin Retrievals Metrics</mock-Admin-Retrievals-Metrics>
))

const setup = () => {
  const props = {
    onFetchAdminRetrievalsMetrics: jest.fn(),
    onUpdateAdminRetrievalsMetricsStartDate: jest.fn(),
    onUpdateAdminRetrievalsMetricsEndDate: jest.fn(),
    retrievals: {}
  }

  // https://testing-library.com/docs/example-react-router/
  render(<AdminRetrievalsMetricsContainer {...props} />, { wrapper: BrowserRouter })

  return props
}

describe('mapDispatchToProps', () => {
  test('onFetchAdminRetrievalsMetrics calls actions.onFetchAdminRetrievalsMetrics', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievalsMetrics')

    mapDispatchToProps(dispatch).onFetchAdminRetrievalsMetrics()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateAdminRetrievalsMetricsStartDate calls actions.updateAdminRetrievalsMetricsStartDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsMetricsStartDate')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsMetricsStartDate('start-date')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('start-date')
  })

  test('onUpdateAdminRetrievalsEndDate calls actions.updateAdminRetrievalsMetricsEndDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsMetricsEndDate')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsMetricsEndDate('end-date')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('end-date')
  })

  describe('mapStateToProps', () => {
    test('returns the correct state', () => {
      const store = {
        admin: {
          retrievalsMetrics: {
            isLoading: false,
            isLoaded: false
          }
        }
      }

      const expectedState = {
        retrievalsMetrics: {
          isLoading: false,
          isLoaded: false
        },
        retrievalsLoading: false,
        retrievalsLoaded: false
      }

      expect(mapStateToProps(store)).toEqual(expectedState)
    })
  })
})

describe('AdminRetrievalsMetricsContainer component', () => {
  test('render AdminRetrievalsMetrics with the correct props', () => {
    const {
      onFetchAdminRetrievalsMetrics,
      onUpdateAdminRetrievalsMetricsStartDate,
      onUpdateAdminRetrievalsMetricsEndDate,
      retrievals
    } = setup()

    expect(AdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsMetrics).toHaveBeenCalledWith(
      {
        onFetchAdminRetrievalsMetrics,
        onUpdateAdminRetrievalsMetricsStartDate,
        onUpdateAdminRetrievalsMetricsEndDate,
        retrievalsMetrics: retrievals
      },
      {}
    )

    expect(screen.getByText('Mock Admin Retrievals Metrics')).toBeInTheDocument()
  })
})
