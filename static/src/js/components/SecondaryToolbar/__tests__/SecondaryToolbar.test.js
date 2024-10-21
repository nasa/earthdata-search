import React from 'react'
import {
  render,
  screen,
  within,
  act
} from '@testing-library/react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'

import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

// Import Enzyme, { shallow } from 'enzyme'
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
// import { LinkContainer } from 'react-router-bootstrap'

import SecondaryToolbar from '../SecondaryToolbar'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => {
  const mockPortalFeatureContainer = jest.fn(({ children }) => (
    <mock-mockPortalFeatureContainer data-testid="mockPortalFeatureContainer">
      {children}
    </mock-mockPortalFeatureContainer>
  ))

  return mockPortalFeatureContainer
})
// Enzyme.configure({ adapter: new Adapter() })

const setup = (state, overrideProps) => {
  const user = userEvent.setup()
  const onLogout = jest.fn()
  const onUpdateProjectName = jest.fn()
  const onChangePath = jest.fn()
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
    onLogout,
    onUpdateProjectName,
    onChangePath,
    ursProfile: {
      first_name: 'First'
    },
    secondaryToolbarEnabled: true,
    onStartTour: jest.fn(),
    ...overrideProps
  }

  if (state === 'loggedIn') props.authToken = 'fakeauthkey'
  const history = createMemoryHistory()

  render(
    <Router history={history} location={props.location}>
      <SecondaryToolbar {...props} />
    </Router>
  )

  return {
    onLogout,
    onUpdateProjectName,
    onChangePath,
    user
  }
}

describe('SecondaryToolbar component', () => {
  describe('when logged out', () => {
    test('should render a login button', () => {
      setup()
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    test.only('should not render the user dropdown', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'Save Project' })).not.toBeInTheDocument()
    })

    test('should not render the project dropdown', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.secondary-toolbar__project-name-dropdown').length).toEqual(1)
    })
  })

  describe('when the secondary toolbar is meant to be disabled', () => {
    describe('when the user is logged in', () => {
      test('secondary toolbar components are not being rendered', () => {
        const { enzymeWrapper } = setup('loggedIn', { secondaryToolbarEnabled: false })
        expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').length).toBe(0)
      })
    })

    describe('when the user is logged out', () => {
      test('secondary toolbar components are not being rendered', () => {
        const { enzymeWrapper } = setup('loggedOut', { secondaryToolbarEnabled: false })
        expect(enzymeWrapper.find('.secondary-toolbar__user-dropdown').length).toBe(0)
      })
    })
  })

  describe('when logged in', () => {
    beforeEach(() => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    test.only('should render the user and project name dropdowns', () => {
      setup('loggedIn')
      expect(screen.getByRole('button', { name: 'Create a project with your current search' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument()
    })

    test.only('should not render the login button', () => {
      setup('loggedIn')
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    })

    test.only('clicking the logout button should call handleLogout', async () => {
      const { onLogout, user } = setup('loggedIn')

      const usermenuButton = screen.getByRole('button', { name: 'User menu' })

      await act(async () => {
        await user.click(usermenuButton)
      })

      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      await user.click(logoutButton)

      expect(onLogout).toBeCalledTimes(1)
    })

    describe('Download Status and History link', () => {
      test('adds the ee param if the earthdataEnvironment is different than the deployed environment', () => {
        setup('loggedIn', { earthdataEnvironment: 'uat' })
        const downloadLink = enzymeWrapper.find('.secondary-toolbar__downloads')
        const linkContainer = downloadLink.parents(LinkContainer)

        expect(linkContainer.props().to).toEqual({
          pathname: '/downloads',
          search: '?ee=uat'
        })
      })

      test('does not add the ee param if the earthdataEnvironment is the deployed environment', () => {
        const { enzymeWrapper } = setup('loggedIn')

        const downloadLink = enzymeWrapper.find('.secondary-toolbar__downloads')
        const linkContainer = downloadLink.parents(LinkContainer)

        expect(linkContainer.props().to).toEqual({
          pathname: '/downloads',
          search: ''
        })
      })
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
