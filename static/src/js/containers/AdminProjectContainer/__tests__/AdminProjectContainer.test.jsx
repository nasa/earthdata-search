import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdminProject from '../../../components/AdminProject/AdminProject'
import {
  AdminProjectContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminProjectContainer'

jest.mock('../../../components/AdminProject/AdminProject', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useParams: jest.fn().mockReturnValue({
    id: '1234'
  })
}))

const setup = setupTest({
  Component: AdminProjectContainer,
  defaultProps: {
    onFetchAdminProject: jest.fn(),
    projects: {
      1234: {
        mock: 'project'
      }
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onFetchAdminProject calls actions.fetchAdminProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminProject')

    mapDispatchToProps(dispatch).onFetchAdminProject('id')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('id')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        projects: {
          byId: {}
        }
      }
    }

    const expectedState = {
      projects: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminProjectContainer component', () => {
  test('render AdminProject with the correct props', () => {
    const { props } = setup()

    expect(props.onFetchAdminProject).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminProject).toHaveBeenCalledWith('1234')

    expect(AdminProject).toHaveBeenCalledTimes(1)
    expect(AdminProject).toHaveBeenCalledWith({
      project: {
        mock: 'project'
      }
    }, {})
  })
})
