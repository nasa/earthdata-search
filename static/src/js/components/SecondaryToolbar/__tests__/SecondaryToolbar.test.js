import React from 'react'
import {
  render,
  screen,
  within,
  act
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import Providers from '../../../providers/Providers/Providers'

import SecondaryToolbar from '../SecondaryToolbar'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => {
  const mockPortalFeatureContainer = jest.fn(({ children }) => (
    <mock-mockPortalFeatureContainer data-testid="mockPortalFeatureContainer">
      {children}
    </mock-mockPortalFeatureContainer>
  ))

  return mockPortalFeatureContainer
})

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const mockPortalLinkContainer = jest.fn(({ children }) => (
    <mock-mockPortalLinkContainer data-testid="mockPortalLinkContainer">
      {children}
    </mock-mockPortalLinkContainer>
  ))

  return mockPortalLinkContainer
})

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
      first_name: 'First Name'
    },
    secondaryToolbarEnabled: true,
    ...overrideProps
  }

  if (state === 'loggedIn') props.authToken = 'fakeauthkey'

  const history = createMemoryHistory()

  render(
    <Providers>
      <Router history={history} location={props.location}>
        <SecondaryToolbar {...props} />
      </Router>
    </Providers>
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
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    })

    test('hovering over the login button should show a tool-tip', async () => {
      const { user } = setup()
      const loginButton = screen.getByRole('button', { name: 'Log In' })

      await act(async () => {
        await user.hover(loginButton)
      })

      expect(screen.getByText('Log In with Earthdata Login')).toBeVisible()
    })

    test('should not render the user dropdown', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'First Name' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Save Project' })).not.toBeInTheDocument()
    })

    test('should not render the project dropdown', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'Save Project' })).not.toBeInTheDocument()
    })
  })

  describe('when the secondary toolbar is meant to be disabled', () => {
    describe('when the user is logged in', () => {
      test('secondary toolbar components are not being rendered', () => {
        setup('loggedIn', { secondaryToolbarEnabled: false })
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
      })
    })

    describe('when the user is logged out', () => {
      test('secondary toolbar components are not being rendered', () => {
        setup('loggedOut', { secondaryToolbarEnabled: false })
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
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

    test('should render the user and project name dropdowns', () => {
      setup('loggedIn')
      const saveButton = screen.getByRole('button', { name: 'Save Project' })

      expect(saveButton).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'First Name' })).toBeInTheDocument()
    })

    test('should not render the login button', () => {
      setup('loggedIn')
      expect(screen.queryByRole('button', { name: 'Log In' })).not.toBeInTheDocument()
    })

    test('clicking the logout button should call handleLogout', async () => {
      const { onLogout, user } = setup('loggedIn')
      const usermenuButton = screen.getByRole('button', { name: 'First Name' })

      await act(async () => {
        await user.click(usermenuButton)
      })

      const logoutButton = screen.getByRole('button', { name: 'Logout' })

      await user.click(logoutButton)
      expect(onLogout).toBeCalledTimes(1)
    })

    describe('Download Status and History link', () => {
      test('adds the ee param if the earthdataEnvironment is different than the deployed environment', async () => {
        const { user } = setup('loggedIn', { earthdataEnvironment: 'uat' })
        const usermenuButton = screen.queryByRole('button', { name: 'First Name' })

        await act(async () => {
          await user.click(usermenuButton)
        })

        const downloadStatusButton = screen.getByRole('link', { name: 'Download Status & History' })
        expect(downloadStatusButton.href).toMatch('downloads?ee=uat')
      })

      test('does not add the ee param if the earthdataEnvironment is the deployed environment', async () => {
        const { user } = setup('loggedIn')
        const usermenuButton = screen.getByRole('button', { name: 'First Name' })

        await act(async () => {
          await user.click(usermenuButton)
        })

        const downloadStatusButton = screen.getByRole('link', { name: 'Download Status & History' })
        expect(downloadStatusButton.href).toMatch('downloads')
      })
    })
  })

  describe('#handleKeypress', () => {
    test('calls stopPropagation and preventDefault on \'Enter\' press', async () => {
      const { user } = setup('loggedIn')
      const myProjectButton = screen.getByRole('button', { name: 'Save Project' })

      await act(async () => {
        await user.click(myProjectButton)
      })

      expect(within(myProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')

      const projectNameField = within(myProjectButton.parentElement).getByRole('textbox')

      await user.type(projectNameField, 'test project name')

      // Use the enter key ensure that event is not propagated
      const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault')
      const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation')
      await act(async () => {
        await user.type(projectNameField, '{Enter}')
      })

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1)

      preventDefaultSpy.mockRestore()
      stopPropagationSpy.mockRestore()
    })

    test('does not call stopPropagation and preventDefault on a non-\'Enter\' press', async () => {
      const { user } = setup('loggedIn')
      const myProjectButton = screen.getByRole('button', { name: 'Save Project' })

      await act(async () => {
        await user.click(myProjectButton)
      })

      expect(within(myProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')

      const projectNameField = within(myProjectButton.parentElement).getByRole('textbox')

      await user.type(projectNameField, 'test project name')

      const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault')
      const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation')
      await user.type(projectNameField, '{space}')

      expect(preventDefaultSpy).toHaveBeenCalledTimes(0)
      expect(stopPropagationSpy).toHaveBeenCalledTimes(0)
      preventDefaultSpy.mockRestore()
      stopPropagationSpy.mockRestore()
    })
  })

  describe('My Project button', () => {
    describe('when there are no projectCollectionIds', () => {
      test('does not display the My Project button', () => {
        setup()
        expect(screen.queryByRole('button', { name: 'View Project' })).not.toBeInTheDocument()
      })
    })

    describe('when there are projectCollectionIds', () => {
      test('displays the My Project button', () => {
        setup('loggedout', { projectCollectionIds: ['123'] })
        expect(screen.getByRole('button', { name: 'My Project' })).toBeInTheDocument()
      })
    })

    test('hovering over My Project renders a tool-tip', async () => {
      const { user } = setup(undefined, { projectCollectionIds: ['123'] })
      await act(async () => {
        await user.hover(screen.getByRole('button', { name: 'My Project' }))
      })

      expect(screen.getByText('View your project')).toBeVisible()
    })
  })

  describe('Project name dropdown', () => {
    test('does not display the project dropdown on the projects page', () => {
      setup(undefined, {
        location: {
          pathname: '/project'
        }
      })

      const myProjectButton = screen.queryByRole('button', { name: 'Save Project' })
      expect(myProjectButton).not.toBeInTheDocument()
    })

    test('clicking the save project dropdown sets the state', async () => {
      const { user } = setup('loggedIn')
      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })

      await act(async () => {
        await user.click(saveProjectButton)
      })

      expect(within(saveProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')
    })

    test('hovering over saved project renders the tool-tip', async () => {
      const { user } = setup('loggedIn')
      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })

      await act(async () => {
        await user.hover(saveProjectButton)
      })

      expect(screen.getByText('Create a project with your current search')).toBeVisible()
    })

    test('clicking the save button sets the state and calls onUpdateProjectName', async () => {
      const { user, onUpdateProjectName } = setup('loggedIn')
      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })

      await act(async () => {
        await user.click(saveProjectButton)
      })

      expect(within(saveProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')

      const projectNameField = within(saveProjectButton.parentElement).getByRole('textbox')

      await user.type(projectNameField, 'test project name')

      const saveProjectNameButton = screen.getByRole('button', { name: 'Save project name' })

      await act(async () => {
        await user.click(saveProjectNameButton)
      })

      expect(onUpdateProjectName).toBeCalledTimes(1)
      expect(onUpdateProjectName).toBeCalledWith('test project name')
    })
  })

  test('renders the login button under PortalFeatureContainer', () => {
    setup(undefined)
    const loginButton = screen.getByRole('button', { name: 'Log In' })
    expect(within(loginButton.parentElement.parentElement).getByTestId('mockPortalFeatureContainer')).toBeInTheDocument()
  })

  describe('adding classname for map view', () => {
    test('when not in map view page', () => {
      setup('loggedIn', {
        location: {
          pathname: '/project'
        }
      })

      const mockPortalFeatureContainer = screen.getByTestId('mockPortalFeatureContainer')
      expect(mockPortalFeatureContainer.parentElement.className).toEqual('secondary-toolbar')
    })

    test('when in map view page', () => {
      setup('loggedIn', {
        location: {
          pathname: '/search'
        }
      })

      const mockPortalFeatureContainer = screen.getByTestId('mockPortalFeatureContainer')
      expect(mockPortalFeatureContainer.parentElement.className).toEqual('secondary-toolbar secondary-toolbar--map-overlay')
    })
  })

  describe('when navigating the Search Tour from the secondary toolbar', () => {
    // Tour functionality is being tested in tour.spec.js
    describe('while the user is logged out', () => {
      test('tour button renders', () => {
        setup('loggedOut')
        const tourButton = screen.getByRole('button', { name: 'Start tour' })
        expect(tourButton).toBeInTheDocument()
      })
    })

    describe('while the user is logged in', () => {
      test('tour button renders', () => {
        setup()
        const tourButton = screen.getByRole('button', { name: 'Start tour' })
        expect(tourButton).toBeInTheDocument()
      })
    })

    test('hovering over the tour renders a tool-tip', async () => {
      const { user } = setup()
      const tourButton = screen.getByRole('button', { name: 'Start tour' })

      await act(async () => {
        await user.hover(tourButton)
      })

      expect(screen.getByText('Take a tour to learn how to use Earthdata Search')).toBeVisible()
    })
  })
})
