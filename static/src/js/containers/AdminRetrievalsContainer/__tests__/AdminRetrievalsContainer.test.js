import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import {
  AdminRetrievalsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalsContainer'

jest.mock('../../../components/AdminRetrievals/AdminRetrievals', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminRetrievalsContainer,
  defaultProps: {
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
    const { props } = setup()

    expect(props.onFetchAdminRetrievals).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminRetrievals).toHaveBeenCalledWith()

    expect(AdminRetrievals).toHaveBeenCalledTimes(1)
    expect(AdminRetrievals).toHaveBeenCalledWith({
      onAdminViewRetrieval: expect.any(Function),
      onFetchAdminRetrievals: expect.any(Function),
      onUpdateAdminRetrievalsSortKey: expect.any(Function),
      onUpdateAdminRetrievalsPageNum: expect.any(Function),
      retrievals: {}
    }, {})
  })
})
