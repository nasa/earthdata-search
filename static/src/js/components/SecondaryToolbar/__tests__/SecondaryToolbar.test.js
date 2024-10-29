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
      first_name: 'First'
    },
    secondaryToolbarEnabled: true,
    onStartTour: jest.fn(),
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
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    })

    test('should not render the user dropdown', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'Save Project' })).not.toBeInTheDocument()
    })

    test('should not render the project dropdown', () => {
      setup()
      expect(screen.queryByRole('button', { name: 'Create a project with your current search' })).not.toBeInTheDocument()
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
      expect(screen.getByRole('button', { name: 'Create a project with your current search' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'User menu' })).toBeInTheDocument()
    })

    test('should not render the login button', () => {
      setup('loggedIn')
      expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument()
    })

    test('clicking the logout button should call handleLogout', async () => {
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
      test('adds the ee param if the earthdataEnvironment is different than the deployed environment', async () => {
        const { user } = setup('loggedIn', { earthdataEnvironment: 'uat' })

        const usermenuButton = screen.getByRole('button', { name: 'User menu' })

        await act(async () => {
          await user.click(usermenuButton)
        })

        const downloadStatusButton = screen.getByRole('link', { name: 'Download Status & History' })
        expect(downloadStatusButton.href).toMatch('downloads?ee=uat')
      })

      test('does not add the ee param if the earthdataEnvironment is the deployed environment', async () => {
        const { user } = setup('loggedIn')
        const usermenuButton = screen.getByRole('button', { name: 'User menu' })

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
      const myProjectButton = screen.getByRole('button', { name: 'Create a project with your current search' })

      await act(async () => {
        await user.click(myProjectButton)
      })

      expect(within(myProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')

      const projectNameField = within(myProjectButton.parentElement).getByRole('textbox')

      await user.type(projectNameField, 'test project name')

      // Use the enter key ensure that event is not propogated
      const preventDefaultSpy = jest.spyOn(Event.prototype, 'preventDefault')
      const stopPropagationSpy = jest.spyOn(Event.prototype, 'stopPropagation')
      await user.type(projectNameField, '{Enter}')

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
      preventDefaultSpy.mockRestore()
      stopPropagationSpy.mockRestore()
    })

    test('does not call stopPropagation and preventDefault on a non-\'Enter\' press', async () => {
      const { user } = setup('loggedIn')
      const myProjectButton = screen.getByRole('button', { name: 'Create a project with your current search' })

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
        const myProjectButton = screen.getByRole('button', { name: 'View Project' })
        expect(within(myProjectButton).getByText('My Project')).toBeDefined()
      })
    })
  })

  describe('Project name dropdown', () => {
    test('does not display the project dropdown on the projects page', () => {
      setup(undefined, {
        location: {
          pathname: '/project'
        }
      })

      const myProjectButton = screen.queryByRole('button', { name: 'Create a project with your current search' })
      expect(myProjectButton).not.toBeInTheDocument()
    })

    test('clicking the dropdown sets the state', async () => {
      const { user } = setup('loggedIn')
      // The Save project button
      const myProjectButton = screen.getByRole('button', { name: 'Create a project with your current search' })
      await act(async () => {
        await user.click(myProjectButton)
      })

      expect(within(myProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')
      expect(within(myProjectButton.parentElement).getByRole('button', { name: 'Save project name' })).toBeInTheDocument()
    })

    test('clicking the save button sets the state and calls onUpdateProjectName', async () => {
      const { user, onUpdateProjectName } = setup('loggedIn')
      const myProjectButton = screen.getByRole('button', { name: 'Create a project with your current search' })

      await act(async () => {
        await user.click(myProjectButton)
      })

      expect(within(myProjectButton.parentElement).getByRole('textbox').placeholder).toBe('Untitled Project')

      const projectNameField = within(myProjectButton.parentElement).getByRole('textbox')

      await user.type(projectNameField, 'test project name')

      const saveProjectButton = screen.getByRole('button', { name: 'Save project name' })

      await act(async () => {
        await user.click(saveProjectButton)
      })

      expect(onUpdateProjectName).toBeCalledTimes(1)
      expect(onUpdateProjectName).toBeCalledWith('test project name')
    })
  })

  test('renders the login button under PortalFeatureContainer', () => {
    setup(undefined)
    const loginButton = screen.getByRole('button', { name: 'Login' })
    expect(within(loginButton.parentElement.parentElement).getByTestId('mockPortalFeatureContainer')).toBeInTheDocument()
  })

  describe('adding classame for map view', () => {
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
})
