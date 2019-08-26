import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as tinyCookie from 'tiny-cookie'
import SecondaryToolbar from '../SecondaryToolbar'

Enzyme.configure({ adapter: new Adapter() })

function setup(state) {
  const props = {
    authToken: '',
    location: {
      pathname: '/search'
    },
    portal: {
      portalId: ''
    },
    projectIds: []
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
  })

  describe('when logged in', () => {
    test('should render the user dropdown', () => {
      const { enzymeWrapper } = setup('loggedIn')

      expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').length).toEqual(1)
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

    test('the logout button should return to the root URL without a portal', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const logoutButton = enzymeWrapper.find('.secondary-toolbar__logout')
      expect(logoutButton.props().href).toEqual('/')
    })

    test('the logout button should return to the root portal URL with a portal', () => {
      const { enzymeWrapper } = setup('loggedIn')

      enzymeWrapper.setProps({
        portal: {
          portalId: 'simple'
        }
      })

      const logoutButton = enzymeWrapper.find('.secondary-toolbar__logout')
      expect(logoutButton.props().href).toEqual('/portal/simple/')
    })
  })

  describe('handleLogout', () => {
    test('successfully calls tiny-cookie remove', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const removeMock = jest.spyOn(tinyCookie, 'remove')

      enzymeWrapper.instance().handleLogout()

      expect(removeMock).toBeCalledTimes(1)
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
})
