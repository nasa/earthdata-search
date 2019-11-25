import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { SavedProjectsContainer } from '../SavedProjectsContainer'
import { SavedProjects } from '../../../components/SavedProjects/SavedProjects'

Enzyme.configure({ adapter: new Adapter() })

function setup(props) {
  const enzymeWrapper = shallow(<SavedProjectsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

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
