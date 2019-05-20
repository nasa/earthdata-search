import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Dropdown } from 'react-bootstrap'
import SecondaryToolbar from '../SecondaryToolbar'

Enzyme.configure({ adapter: new Adapter() })

function setup(state) {
  const props = {
    auth: ''
  }

  if (state === 'loggedIn') props.auth = 'fakeauthkey'

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
  })
})
