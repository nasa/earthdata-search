import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdminRetrievalsMetrics from '../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics'
import {
  AdminRetrievalsMetricsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalsMetricsContainer'

jest.mock('../../../components/AdminRetrievalsMetrics/AdminRetrievalsMetrics', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrievalsMetricsContainer,
  defaultProps: {
    onFetchAdminRetrievalsMetrics: jest.fn(),
    onUpdateAdminRetrievalsMetricsStartDate: jest.fn(),
    onUpdateAdminRetrievalsMetricsEndDate: jest.fn(),
    retrievals: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onFetchAdminRetrievalsMetrics calls actions.onFetchAdminRetrievalsMetrics', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievalsMetrics')

    mapDispatchToProps(dispatch).onFetchAdminRetrievalsMetrics()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onUpdateAdminRetrievalsMetricsStartDate calls actions.updateAdminRetrievalsMetricsStartDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsMetricsStartDate')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsMetricsStartDate('start-date')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('start-date')
  })

  test('onUpdateAdminRetrievalsEndDate calls actions.updateAdminRetrievalsMetricsEndDate', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsMetricsEndDate')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsMetricsEndDate('end-date')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('end-date')
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
    setup()

    expect(AdminRetrievalsMetrics).toHaveBeenCalledTimes(1)
    expect(AdminRetrievalsMetrics).toHaveBeenCalledWith(
      {
        onFetchAdminRetrievalsMetrics: expect.any(Function),
        onUpdateAdminRetrievalsMetricsStartDate: expect.any(Function),
        onUpdateAdminRetrievalsMetricsEndDate: expect.any(Function),
        retrievalsMetrics: {}
      },
      {}
    )
  })
})
