import React from 'react'
import { render } from '@testing-library/react'

jest.mock('../../../components/AdminRetrieval/AdminRetrieval', () => jest.fn(({ children }) => (
  <mock-AdminRetrieval data-testid="AdminRetrieval">
    {children}
  </mock-AdminRetrieval>
)))

import actions from '../../../actions'
import AdminRetrieval from '../../../components/AdminRetrieval/AdminRetrieval'
import { AdminRetrievalContainer, mapDispatchToProps, mapStateToProps } from '../AdminRetrievalContainer'

describe('mapDispatchToProps', () => {
  test('onFetchAdminRetrieval calls actions.fetchAdminRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrieval')

    mapDispatchToProps(dispatch).onFetchAdminRetrieval('id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('id')
  })

  test('onRequeueOrder calls actions.requeueOrder', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'requeueOrder')

    mapDispatchToProps(dispatch).onRequeueOrder('id')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('id')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        retrievals: {
          byId: {}
        }
      }
    }

    const expectedState = {
      retrievals: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminRetrievalContainer component', () => {
  test('render AdminRetrieval with the correct props', () => {
    const onFetchAdminRetrievalMock = jest.fn()
    const onRequeueOrderMock = jest.fn()
    const props = {
      match: {
        params: {
          id: '1'
        }
      },
      onFetchAdminRetrieval: onFetchAdminRetrievalMock,
      onRequeueOrder: onRequeueOrderMock,
      retrieval: {}
    }

    const { rerender } = render((<AdminRetrievalContainer {...props} />))

    expect(onFetchAdminRetrievalMock).toHaveBeenCalledTimes(1)
    expect(onFetchAdminRetrievalMock).toHaveBeenCalledWith('1')

    rerender((<AdminRetrievalContainer {...props} retrievals={{ 1: 'mock-retrieval' }} />))

    expect(AdminRetrieval).toHaveBeenCalledTimes(2)
    expect(AdminRetrieval).toHaveBeenCalledWith({
      retrieval: undefined,
      onRequeueOrder: onRequeueOrderMock
    }, {})
    expect(AdminRetrieval).toHaveBeenCalledWith({
      retrieval: 'mock-retrieval',
      onRequeueOrder: onRequeueOrderMock
    }, {})
  })
})
