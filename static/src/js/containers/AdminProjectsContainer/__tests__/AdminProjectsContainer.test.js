import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import AdminProjects from '../../../components/AdminProjects/AdminProjects'
import { AdminProjectsContainer, mapDispatchToProps, mapStateToProps } from '../AdminProjectsContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    history: {
      push: jest.fn()
    },
    onAdminViewProject: jest.fn(),
    onFetchAdminProjects: jest.fn(),
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects: {}
  }

  const enzymeWrapper = shallow(<AdminProjectsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onAdminViewProject calls actions.adminViewProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'adminViewProject')

    mapDispatchToProps(dispatch).onAdminViewProject('projectId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('projectId')
  })

  test('onFetchAdminProjects calls actions.fetchAdminProjects', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchAdminProjects')

    mapDispatchToProps(dispatch).onFetchAdminProjects()

    expect(spy).toBeCalledTimes(1)
  })

  test('onUpdateAdminProjectsSortKey calls actions.updateAdminProjectsSortKey', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminProjectsSortKey')

    mapDispatchToProps(dispatch).onUpdateAdminProjectsSortKey('sort-key')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('sort-key')
  })

  test('onUpdateAdminProjectsPageNum calls actions.updateAdminProjectsPageNum', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAdminProjectsPageNum')

    mapDispatchToProps(dispatch).onUpdateAdminProjectsPageNum('sort-key')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('sort-key')
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
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(AdminProjects).length).toBe(1)
  })
})
