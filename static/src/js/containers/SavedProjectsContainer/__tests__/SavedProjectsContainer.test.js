import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, SavedProjectsContainer } from '../SavedProjectsContainer'
import { SavedProjects } from '../../../components/SavedProjects/SavedProjects'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<SavedProjectsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onDeleteSavedProject calls actions.deleteSavedProject', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'deleteSavedProject')

    mapDispatchToProps(dispatch).onDeleteSavedProject('projectId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('projectId')
  })

  test('onFetchSavedProjects calls actions.fetchSavedProjects', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'fetchSavedProjects')

    mapDispatchToProps(dispatch).onFetchSavedProjects()

    expect(spy).toBeCalledTimes(1)
  })

  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('path')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      savedProjects: {
        projects: {},
        isLoading: false,
        isLoaded: false
      }
    }

    const expectedState = {
      savedProjects: {},
      savedProjectsIsLoading: false,
      savedProjectsIsLoaded: false
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('SavedProjectsContainer component', () => {
  describe('when passed the correct props', () => {
    test('renders a table when a retrieval exists with one collection that has no title', () => {
      const { enzymeWrapper } = setup({
        savedProjects: [
          {
            id: '4517239960',
            name: 'project 1',
            path: '/search?p=!C123456-EDSC',
            created_at: '2019-09-05 00:00:00.000'
          },
          {
            id: '2057964173',
            name: 'project 3',
            path: '/search?p=!C123456-EDSC',
            created_at: '2019-09-05 00:00:00.000'
          }
        ],
        savedProjectsIsLoading: false,
        savedProjectsIsLoaded: true,
        onChangePath: jest.fn(),
        onDeleteSavedProject: jest.fn(),
        onFetchSavedProjects: jest.fn()
      })

      expect(enzymeWrapper.find(SavedProjects).length).toBe(1)
    })
  })
})
