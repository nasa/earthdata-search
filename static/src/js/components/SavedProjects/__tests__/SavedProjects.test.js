import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Table } from 'react-bootstrap'

import Spinner from '../../Spinner/Spinner'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'
import { SavedProjects } from '../SavedProjects'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    savedProjects: [],
    savedProjectsIsLoading: false,
    savedProjectsIsLoaded: false,
    onChangePath: jest.fn(),
    onDeleteSavedProject: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SavedProjects {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SavedProjects component', () => {
  describe('when the projects are loading', () => {
    test('shows a loading state', () => {
      const { enzymeWrapper } = setup({
        savedProjectsIsLoading: true
      })

      expect(enzymeWrapper.find(Spinner).length).toBe(1)
    })
  })

  describe('wehn the projects have loaded', () => {
    test('renders a message when no saved projects exist', () => {
      const { enzymeWrapper } = setup({
        savedProjectsIsLoaded: true
      })

      expect(enzymeWrapper.find(Table).length).toBe(0)
      expect(enzymeWrapper.find('p').text()).toBe('No saved projects to display.')
    })

    test('renders a table when a saved project exists with one collection', () => {
      const { enzymeWrapper } = setup({
        savedProjects: [{
          id: '8069076',
          name: 'test name',
          path: '/search?p=!C123456-EDSC',
          created_at: '2019-08-25T11:58:14.390Z'
        }],
        savedProjectsIsLoaded: true
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/search?projectId=8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('test name')
      expect(enzymeWrapper.find('tbody tr td').at(1).text()).toEqual('1 Collection')
    })

    test('renders a table when a saved project exists with no collections', () => {
      const { enzymeWrapper } = setup({
        savedProjects: [{
          id: '8069076',
          name: 'test name',
          path: '/search',
          created_at: '2019-08-25T11:58:14.390Z'
        }],
        savedProjectsIsLoaded: true
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/search?projectId=8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('test name')
      expect(enzymeWrapper.find('tbody tr td').at(1).text()).toEqual('0 Collections')
    })

    test('renders a table when a saved project exists with two collections and a focusedCollection', () => {
      const { enzymeWrapper } = setup({
        savedProjects: [{
          id: '8069076',
          name: 'test name',
          path: '/search?p=C123456-EDSC!C123456-EDSC!C987654-EDSC',
          created_at: '2019-08-25T11:58:14.390Z'
        }],
        savedProjectsIsLoaded: true
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/search?projectId=8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('test name')
      expect(enzymeWrapper.find('tbody tr td').at(1).text()).toEqual('2 Collections')
    })

    test('renders a table when a saved project exists with one collection without a name', () => {
      const { enzymeWrapper } = setup({
        savedProjects: [{
          id: '8069076',
          name: '',
          path: '/search?p=!C123456-EDSC',
          created_at: '2019-08-25T11:58:14.390Z'
        }],
        savedProjectsIsLoaded: true
      })

      expect(enzymeWrapper.find(Table).length).toBe(1)
      expect(enzymeWrapper.find('tbody tr').length).toBe(1)
      expect(enzymeWrapper.find(PortalLinkContainer).prop('to')).toEqual('/search?projectId=8069076')
      expect(enzymeWrapper.find(PortalLinkContainer).prop('children')).toEqual('Untitled Project')
    })

    test('deleting a project calls onDeleteSavedProject', () => {
      const { enzymeWrapper, props } = setup({
        savedProjects: [{
          id: '8069076',
          name: 'test name',
          path: '/search?p=!C123456-EDSC',
          created_at: '2019-08-25T11:58:14.390Z'
        }],
        savedProjectsIsLoaded: true
      })
      window.confirm = jest.fn(() => true)

      const button = enzymeWrapper.find('.saved-projects__button--remove')
      button.simulate('click')

      expect(window.confirm).toBeCalledTimes(1)
      expect(props.onDeleteSavedProject).toBeCalledTimes(1)
      expect(props.onDeleteSavedProject).toBeCalledWith('8069076')
    })
  })
})
