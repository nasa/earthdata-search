import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import AdminProjects from '../../../components/AdminProjects/AdminProjects'
import {
  AdminProjectsContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AdminProjectsContainer'

jest.mock('../../../components/AdminProjects/AdminProjects', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: AdminProjectsContainer,
  defaultProps: {
    onAdminViewProject: jest.fn(),
    onFetchAdminProjects: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects: {}
  }
})

describe('mapDispatchToProps', () => {
  test('onAdminViewProject calls actions.adminViewProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'adminViewProject')

    mapDispatchToProps(dispatch).onAdminViewProject('projectId')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('projectId')
  })

  test('onFetchAdminProjects calls actions.fetchAdminProjects', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminProjects')

    mapDispatchToProps(dispatch).onFetchAdminProjects()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('onUpdateAdminProjectsSortKey calls actions.updateAdminProjectsSortKey', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminProjectsSortKey')

    mapDispatchToProps(dispatch).onUpdateAdminProjectsSortKey('sort-key')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sort-key')
  })

  test('onUpdateAdminProjectsPageNum calls actions.updateAdminProjectsPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminProjectsPageNum')

    mapDispatchToProps(dispatch).onUpdateAdminProjectsPageNum('sort-key')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('sort-key')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      admin: {
        projects: {
          isLoading: false,
          isLoaded: false
        }
      }
    }

    const expectedState = {
      projects: {
        isLoading: false,
        isLoaded: false
      },
      projectsLoading: false,
      projectsLoaded: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AdminProjectsContainer component', () => {
  test('render AdminProjects with the correct props', () => {
    const { props } = setup()

    expect(props.onFetchAdminProjects).toHaveBeenCalledTimes(1)
    expect(props.onFetchAdminProjects).toHaveBeenCalledWith()

    expect(AdminProjects).toHaveBeenCalledTimes(1)
    expect(AdminProjects).toHaveBeenCalledWith({
      onAdminViewProject: expect.any(Function),
      onFetchAdminProjects: expect.any(Function),
      onUpdateAdminProjectsSortKey: expect.any(Function),
      onUpdateAdminProjectsPageNum: expect.any(Function),
      projects: {}
    }, {})
  })
})
