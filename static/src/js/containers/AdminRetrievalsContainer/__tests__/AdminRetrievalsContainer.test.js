import React from 'react'
import { screen } from '@testing-library/react'

import actions from '../../../actions'
import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import {
  AdminRetrievalsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/AdminRetrievals/AdminRetrievals', () => jest.fn(() => <div data-testid="admin-retrievals" />))

const setup = setupTest({
  Component: AdminRetrievalsContainer,
  defaultProps: {
    history: {
      push: jest.fn()
    },
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn(),
    onUpdateAdminRetrievalsSortKey: jest.fn(),
    onUpdateAdminRetrievalsPageNum: jest.fn(),
    retrievals: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onAdminViewRetrieval calls actions.adminViewRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'adminViewRetrieval')

    mapDispatchToProps(dispatch).onAdminViewRetrieval('retrievalId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('retrievalId')
  })

  test('onFetchAdminRetrievals calls actions.fetchAdminRetrievals', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievals')

    mapDispatchToProps(dispatch).onFetchAdminRetrievals()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onFetchAdminRetrievals calls actions.fetchAdminRetrievals with userId', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievals')

    mapDispatchToProps(dispatch).onFetchAdminRetrievals('testuser')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('testuser')
  })

  test('onUpdateAdminRetrievalsSortKey calls actions.updateAdminRetrievalsSortKey', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsSortKey')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsSortKey('sort-key')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sort-key')
  })

  test('onUpdateAdminRetrievalsPageNum calls actions.updateAdminRetrievalsPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsPageNum')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsPageNum('sort-key')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sort-key')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        retrievals: {
          isLoading: false,
          isLoaded: false
        }
      }
    }

    const expectedState = {
      retrievals: {
        isLoading: false,
        isLoaded: false
      },
      retrievalsLoading: false,
      retrievalsLoaded: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminRetrievalsContainer component', () => {
  test('render AdminRetrievals with the correct props', () => {
    setup()

    expect(screen.getByTestId('admin-retrievals')).toBeInTheDocument()
    expect(AdminRetrievals).toHaveBeenCalledTimes(1)
  })
})
