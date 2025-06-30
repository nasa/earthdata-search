import React from 'react'

import actions from '../../../actions'
import AdminRetrievals from '../../../components/AdminRetrievals/AdminRetrievals'
import {
  AdminRetrievalsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../components/AdminRetrievals/AdminRetrievals', () => jest.fn(() => <div />))

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

  test('onFetchAdminRetrievals calls actions.fetchAdminRetrievals with userId and retrievalCollectionId', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrievals')

    mapDispatchToProps(dispatch).onFetchAdminRetrievals('testuser', '1')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('testuser', '1')
  })

  test('onUpdateAdminRetrievalsSortKey calls actions.updateAdminRetrievalsSortKey', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsSortKey')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsSortKey('sort-key', 'user-id')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sort-key', 'user-id')
  })

  test('onUpdateAdminRetrievalsPageNum calls actions.updateAdminRetrievalsPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminRetrievalsPageNum')

    mapDispatchToProps(dispatch).onUpdateAdminRetrievalsPageNum('page-num', 'user-id')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('page-num', 'user-id')
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

describe('when the container is rendered', () => {
  test('calls AdminRetrievals with the correct props', () => {
    const { props } = setup()

    expect(AdminRetrievals).toHaveBeenCalledTimes(1)

    expect(AdminRetrievals).toHaveBeenCalledWith({
      historyPush: props.history.push,
      onAdminViewRetrieval: expect.any(Function),
      onFetchAdminRetrievals: expect.any(Function),
      onUpdateAdminRetrievalsSortKey: expect.any(Function),
      onUpdateAdminRetrievalsPageNum: expect.any(Function),
      retrievals: props.retrievals
    }, {})
  })
})
