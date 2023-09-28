import React from 'react'
import {
  render,
  screen
} from '@testing-library/react'

import '@testing-library/jest-dom'

import { BrowserRouter } from 'react-router-dom'

import actions from '../../../actions'
import AdminRetrievalsMetrics from '../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'
import { AdminRetrievalsMetricsContainer, mapDispatchToProps, mapStateToProps } from '../AdminRetrievalsMetricsContainer'

jest.mock('../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics', () => jest.fn(
  () => <mock-Admin-Retrieval-Metrics>Mock Admin Retrieval Metrics</mock-Admin-Retrieval-Metrics>
))

const setup = () => {
  // todo these const functions aren't really needed right now
  const onFetchAdminMetricsRetrievals = jest.fn()
  const onUpdateAdminMetricsRetrievalsStartDate = jest.fn()
  const onUpdateAdminMetricsRetrievalsEndDate = jest.fn()

  render(<AdminRetrievalsMetricsContainer />, { wrapper: BrowserRouter })

  return {
    onFetchAdminMetricsRetrievals,
    onUpdateAdminMetricsRetrievalsStartDate,
    onUpdateAdminMetricsRetrievalsEndDate
  }
}

describe('mapDispatchToProps', () => {
  test('onFetchAdminMetricsRetrievals calls actions.onFetchAdminMetricsRetrievals', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminMetricsRetrievals')

    mapDispatchToProps(dispatch).onFetchAdminMetricsRetrievals()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateAdminMetricsRetrievalsStartDate calls actions.updateAdminMetricsRetrievalsStartDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminMetricsRetrievalsStartDate')

    mapDispatchToProps(dispatch).onUpdateAdminMetricsRetrievalsStartDate('start-date')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('start-date')
  })

  test('onUpdateAdminRetrievalsSortKey calls actions.updateAdminMetricsRetrievalsEndDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminMetricsRetrievalsEndDate')

    mapDispatchToProps(dispatch).onUpdateAdminMetricsRetrievalsEndDate('end-date')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('end-date')
  })
  // todo this test needs to be improved/refined
  describe('mapStateToProps', () => {
    test.skip('returns the correct state', () => {
      const store = {
        admin: {
          metricsRetrievals: {
            isLoading: false,
            isLoaded: false
          }
        }
      }

      const expectedState = {
        metricsRetrievals: {
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

describe('AdminRetrievalsContainer component', () => {
  test('render AdminRetrievals with the correct props', () => {
    setup()
    expect(AdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Mock Admin Retrieval Metrics')).toBeInTheDocument()
  })
})
