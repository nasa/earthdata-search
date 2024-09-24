import React from 'react'
import { render, screen } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom'

import actions from '../../../actions'
import AdminPreferencesMetrics from '../../../components/AdminPreferencesMetrics/AdminPreferencesMetrics'
import {
  AdminPreferencesMetricsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminPreferencesMetricsContainer'

jest.mock('../../../components/AdminPreferencesMetrics/AdminPreferencesMetrics', () => jest.fn(
  () => (
    <mock-Admin-Preferences-Metrics>
      Mock Admin Preferences Metrics
    </mock-Admin-Preferences-Metrics>
  )
))

const setup = () => {
  const props = {
    onFetchAdminPreferencesMetrics: jest.fn(),
    retrievals: {}
  }

  // https://testing-library.com/docs/example-react-router/
  render(<AdminPreferencesMetricsContainer {...props} />, { wrapper: BrowserRouter })
}

describe('mapDispatchToProps', () => {
  test('onFetchAdminPreferencesMetrics calls actions.onFetchAdminPreferencesMetrics', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminPreferencesMetrics')

    mapDispatchToProps(dispatch).onFetchAdminPreferencesMetrics()

    expect(spy).toBeCalledTimes(1)
  })

  describe('mapStateToProps', () => {
    test('returns the correct state', () => {
      const store = {
        admin: {
          preferencesMetrics: {
            isLoading: false,
            isLoaded: false
          }
        }
      }

      const expectedState = {
        preferencesMetrics: {
          isLoading: false,
          isLoaded: false
        },
        preferencesLoading: false,
        preferencesLoaded: false
      }

      expect(mapStateToProps(store)).toEqual(expectedState)
    })
  })
})

describe('AdminPreferencesMetricsContainer component', () => {
  test('render AdminPreferencesMetrics with the correct props', () => {
    setup()

    expect(AdminPreferencesMetrics).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Mock Admin Preferences Metrics')).toBeInTheDocument()
  })
})
