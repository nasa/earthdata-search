import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'
import * as tinyCookie from 'tiny-cookie'
import SecondaryToolbar from '../SecondaryToolbar'

Enzyme.configure({ adapter: new Adapter() })

function setup(state) {
  const props = {
    authToken: ''
  }

  if (state === 'loggedIn') props.authToken = 'fakeauthTokenkey'

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
  })

  describe('handleLogout', () => {
    test('successfully calls tiny-cookie remove', () => {
      const { enzymeWrapper } = setup('loggedIn')

      const removeMock = jest.spyOn(tinyCookie, 'remove')

      enzymeWrapper.instance().handleLogout()

      expect(removeMock).toBeCalledTimes(1)
    })
  })
})
