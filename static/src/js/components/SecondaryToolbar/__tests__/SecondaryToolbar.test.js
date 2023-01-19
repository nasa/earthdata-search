import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { LinkContainer } from 'react-router-bootstrap'

import SecondaryToolbar from '../SecondaryToolbar'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(state, overrideProps) {
  const props = {
    authToken: '',
    earthdataEnvironment: 'prod',
    location: {
      pathname: '/search'
    },
    portal: {
      portalId: 'edsc'
    },
    projectCollectionIds: [],
    savedProject: {},
    retrieval: {},
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onChangePath: jest.fn(),
    ursProfile: {
      first_name: 'First'
    },
    ...overrideProps
  }

  if (state === 'loggedIn') props.authToken = 'fakeauthkey'

  const enzymeWrapper = shallow(<SecondaryToolbar {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SecondaryToolbar component', () => {
  describe('when logged out', () => {
    test('should render a login button', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.secondary-toolbar__login').length).toEqual(1)
    })

    test('should not render the user dropdown', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').length).toEqual(0)
    })

    test('should not render the project dropdown', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.secondary-toolbar__project-name-dropdown').length).toEqual(0)
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    describe('when on the project page', () => {
      test('the Back to Search link calls onChangePath', () => {
        const { enzymeWrapper, props } = setup('loggedIn')

        enzymeWrapper.setProps({
          location: {
            pathname: '/projects',
            search: '?p=!EDSC-1000'
          }
        })

        const link = enzymeWrapper.find('.secondary-toolbar__back')
        link.simulate('click')

        expect(props.onChangePath).toBeCalledTimes(1)
        expect(props.onChangePath).toBeCalledWith('/search?p=!EDSC-1000')
      })
    })

    describe('when on the downloads page', () => {
      test('the Back to Project link calls onChangePath', () => {
        const { enzymeWrapper, props } = setup('loggedIn')

        enzymeWrapper.setProps({
          location: {
            pathname: '/downloads/1234'
          },
          retrieval: {
            jsondata: {
              source: '?p=!EDSC-1000'
            }
          }
        })

        const link = enzymeWrapper.find('.secondary-toolbar__back')
        link.simulate('click')

        expect(props.onChangePath).toBeCalledTimes(1)
        expect(props.onChangePath).toBeCalledWith('/projects?p=!EDSC-1000')
      })
    })

    test('should render the user dropdown', () => {
      const { enzymeWrapper } = setup('loggedIn')

      expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').length).toEqual(1)
    })

    test('should render the user dropdown', () => {
      const { enzymeWrapper } = setup('loggedIn')

      expect(enzymeWrapper.find('.secondary-toolbar__project-name-dropdown').length).toEqual(1)
    })

    test('should not render a login button', () => {
      const { enzymeWrapper } = setup('loggedIn')

      expect(enzymeWrapper.find('.secondary-toolbar__login').length).toEqual(0)
    })

    test('clicking the logout button should call handleLogout', () => {
      const { enzymeWrapper } = setup('loggedIn')

      // Mock the handleLogout method
      const instance = enzymeWrapper.instance()
      jest.spyOn(instance, 'handleLogout').mockImplementation()
      enzymeWrapper.instance().forceUpdate()

      // Click the Logout button
      const logoutButton = enzymeWrapper.find('.secondary-toolbar__logout')
      logoutButton.simulate('click')

      expect(instance.handleLogout).toBeCalledTimes(1)
    })

    test('the My Project link calls onChangePath', () => {
      const { enzymeWrapper, props } = setup('loggedIn')

      enzymeWrapper.setProps({
        location: {
          pathname: '/search',
          search: '?p=!EDSC-1000'
        },
        projectCollectionIds: ['EDSC-1000']
      })

      const link = enzymeWrapper.find('.secondary-toolbar__project')
      link.simulate('click')

      expect(props.onChangePath).toBeCalledTimes(1)
      expect(props.onChangePath).toBeCalledWith('/projects?p=!EDSC-1000')
    })

    describe('Download Status and History link', () => {
      test('adds the ee param if the earthdataEnvironment is different than the deployed environment', () => {
        const { enzymeWrapper } = setup('loggedIn', { earthdataEnvironment: 'uat' })

        const downloadLink = enzymeWrapper.find('.secondary-toolbar__downloads')
        const linkContainer = downloadLink.parents(LinkContainer)

        expect(linkContainer.props().to).toEqual({ pathname: '/downloads', search: '?ee=uat' })
      })

      test('does not add the ee param if the earthdataEnvironment is the deployed environment', () => {
        const { enzymeWrapper } = setup('loggedIn')

        const downloadLink = enzymeWrapper.find('.secondary-toolbar__downloads')
        const linkContainer = downloadLink.parents(LinkContainer)

        expect(linkContainer.props().to).toEqual({ pathname: '/downloads', search: '' })
      })
    })
  })

  describe('#handleLogout', () => {
    test('calls onLogout', () => {
      const { enzymeWrapper, props } = setup('loggedIn')

      enzymeWrapper.instance().handleLogout()

      expect(props.onLogout).toBeCalledTimes(1)
    })
  })

  describe('#handleKeypress', () => {
    test('calls stopPropagation and preventDefault on \'Enter\' press', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const event = {
        key: 'Enter',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      }
      enzymeWrapper.instance().handleKeypress(event)

      expect(event.stopPropagation).toBeCalledTimes(1)
      expect(event.preventDefault).toBeCalledTimes(1)
    })

    test('does not call stopPropagation and preventDefault on a non-\'Enter\' press', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const event = {
        key: 'Space',
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      }
      enzymeWrapper.instance().handleKeypress(event)

      expect(event.stopPropagation).toBeCalledTimes(0)
      expect(event.preventDefault).toBeCalledTimes(0)
    })
  })

  describe('My Project button', () => {
    describe('when there are no projectCollectionIds', () => {
      test('does not display the My Project button', () => {
        const { enzymeWrapper } = setup()

        expect(enzymeWrapper.exists('.secondary-toolbar__project')).toBeFalsy()
      })
    })

    describe('when there are projectCollectionIds', () => {
      test('dispalys the My Project button', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.setProps({ projectCollectionIds: ['123'] })

        expect(enzymeWrapper.exists('.secondary-toolbar__project')).toBeTruthy()
      })
    })
  })

  describe('Project name dropdown', () => {
    test('does not display the project dropdown on the projects page', () => {
      const { enzymeWrapper } = setup(undefined, {
        location: {
          pathname: '/projects'
        }
      })

      expect(enzymeWrapper.find('.secondary-toolbar__project-name-dropdown').length).toEqual(0)
    })

    test('clicking the dropdown sets the state', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const toggle = enzymeWrapper.find('.secondary-toolbar__project-name-dropdown-toggle')
      toggle.simulate('click')

      expect(enzymeWrapper.state().projectDropdownOpen).toBeTruthy()
    })

    test('clicking the save button sets the state and calls onUpdateProjectName', () => {
      const { enzymeWrapper, props } = setup('loggedIn')

      const toggle = enzymeWrapper.find('.secondary-toolbar__project-name-dropdown-toggle')
      toggle.simulate('click')

      const input = enzymeWrapper.find('.secondary-toolbar__project-name-input')
      input.simulate('change', {
        target: {
          value: 'test project name'
        }
      })

      const saveButton = enzymeWrapper.find('.secondary-toolbar__button.secondary-toolbar__button--submit')
      saveButton.simulate('click')

      expect(enzymeWrapper.state().projectDropdownOpen).toBeFalsy()
      expect(props.onUpdateProjectName).toBeCalledTimes(1)
      expect(props.onUpdateProjectName).toBeCalledWith('test project name')
    })
  })

  test('renders the login button under PortalFeatureContainer', () => {
    const { enzymeWrapper } = setup(undefined)

    const button = enzymeWrapper
      .find(PortalFeatureContainer)
      .find('.secondary-toolbar__login')
    const portalFeatureContainer = button.parents(PortalFeatureContainer)

    expect(button.exists()).toBeTruthy()
    expect(portalFeatureContainer.props().authentication).toBeTruthy()
  })

  test('changing the project name sets the state', () => {
    const { enzymeWrapper } = setup(undefined)

    enzymeWrapper.setProps({
      savedProject: {
        name: 'new name'
      }
    })

    expect(enzymeWrapper.state().projectName).toEqual('new name')
  })
})
