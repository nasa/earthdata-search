import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdminRetrieval from '../../../components/AdminRetrieval/AdminRetrieval'
import {
  AdminRetrievalContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminRetrievalContainer'

jest.mock('../../../components/AdminRetrieval/AdminRetrieval', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useParams: jest.fn().mockReturnValue({
    id: '1234'
  })
}))

const setup = setupTest({
  Component: AdminRetrievalContainer,
  defaultProps: {
    onFetchAdminRetrieval: jest.fn(),
    onRequeueOrder: jest.fn(),
    retrievals: {
      1234: {
        mock: 'retrieval'
      }
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onFetchAdminRetrieval calls actions.fetchAdminRetrieval', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminRetrieval')

    mapDispatchToProps(dispatch).onFetchAdminRetrieval('id')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('id')
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
    const { props } = setup()

    expect(props.onFetchAdminRetrieval).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminRetrieval).toHaveBeenCalledWith('1234')

    expect(AdminRetrieval).toHaveBeenCalledTimes(1)
    expect(AdminRetrieval).toHaveBeenCalledWith({
      onRequeueOrder: expect.any(Function),
      retrieval: {
        mock: 'retrieval'
      }
    }, {})
  })
})
