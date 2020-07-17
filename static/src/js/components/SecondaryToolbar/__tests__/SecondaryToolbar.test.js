import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import SecondaryToolbar from '../SecondaryToolbar'

Enzyme.configure({ adapter: new Adapter() })

function setup(state, overrideProps) {
  const props = {
    authToken: '',
    location: {
      pathname: '/search'
    },
    portal: {
      features: {
        authentication: true
      },
      portalId: 'edsc'
    },
    projectIds: [],
    savedProject: {},
    onLogout: jest.fn(),
    onUpdateProjectName: jest.fn(),
    onChangePath: jest.fn(),
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
  })

  describe('handleLogout', () => {
    test('calls onLogout', () => {
      const { enzymeWrapper, props } = setup('loggedIn')

      enzymeWrapper.instance().handleLogout()

      expect(props.onLogout).toBeCalledTimes(1)
    })
  })

  describe('My Project button', () => {
    describe('when there are no projectIds', () => {
      test('does not display the My Project button', () => {
        const { enzymeWrapper } = setup()

        expect(enzymeWrapper.exists('.secondary-toolbar__project')).toBeFalsy()
      })
    })

    describe('when there are projectIds', () => {
      test('dispalys the My Project button', () => {
        const { enzymeWrapper } = setup()

        enzymeWrapper.setProps({ projectIds: ['123'] })

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

      expect(enzymeWrapper.state('projectDropdownOpen')).toBeTruthy()
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

      expect(enzymeWrapper.state('projectDropdownOpen')).toBeFalsy()
      expect(props.onUpdateProjectName).toBeCalledTimes(1)
      expect(props.onUpdateProjectName).toBeCalledWith('test project name')
    })
  })

  describe('when authentication is disabled', () => {
    test('hides the login button and user dropdown', () => {
      const { enzymeWrapper } = setup(undefined, {
        portal: {
          features: {
            authentication: false
          }
        }
      })

      expect(enzymeWrapper.find('.secondary-toolbar__login').exists()).toBeFalsy()
      expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').exists()).toBeFalsy()
    })
  })
})
