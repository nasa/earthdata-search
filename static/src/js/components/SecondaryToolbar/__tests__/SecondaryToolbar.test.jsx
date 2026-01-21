import React from 'react'
import { screen, within } from '@testing-library/react'
import { useLocation, useParams } from 'react-router-dom'

import SecondaryToolbar from '../SecondaryToolbar'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import GET_RETRIEVAL from '../../../operations/queries/getRetrieval'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

vi.mock('../../../containers/PortalFeatureContainer/PortalFeatureContainer', () => {
  const mockPortalFeatureContainer = vi.fn(({ children }) => (
    <mock-mockPortalFeatureContainer data-testid="mockPortalFeatureContainer">
      {children}
    </mock-mockPortalFeatureContainer>
  ))

  return {
    default: mockPortalFeatureContainer
  }
})

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const mockPortalLinkContainer = vi.fn(({ children }) => (
    <mock-mockPortalLinkContainer data-testid="mockPortalLinkContainer">
      {children}
    </mock-mockPortalLinkContainer>
  ))

  return {
    default: mockPortalLinkContainer
  }
})

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  }),
  useParams: vi.fn().mockReturnValue({})
}))

const setup = setupTest({
  Component: SecondaryToolbar,
  defaultZustandState: {
    savedProject: {
      setProjectName: vi.fn()
    },
    user: {
      logout: vi.fn()
    }
  },
  withApolloClient: true,
  withRouter: true
})

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('SecondaryToolbar component', () => {
  describe('when logged out', () => {
    test('should render a login button', () => {
      setup()

      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    })

    test('hovering over the login button should show a tool-tip', async () => {
      const { user } = setup()

      const loginButton = screen.getByRole('button', { name: 'Log In' })
      await user.hover(loginButton)

      expect(await screen.findByText('Log In with Earthdata Login')).toBeVisible()
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

  describe('when logged in', () => {
    beforeEach(() => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        defaultPortal: 'edsc',
        env: 'prod'
      }))
    })

    test('should render the user and project name dropdowns', () => {
      setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const saveButton = screen.getByRole('button', { name: 'Save Project' })

      expect(saveButton).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'First Name' })).toBeInTheDocument()
    })

    test('should not render the login button', () => {
      setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      expect(screen.queryByRole('button', { name: 'Log In' })).not.toBeInTheDocument()
    })

    test('clicking the logout button should call logout', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const usermenuButton = screen.getByRole('button', { name: 'First Name' })
      await user.click(usermenuButton)

      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      await user.click(logoutButton)

      expect(zustandState.user.logout).toHaveBeenCalledTimes(1)
      expect(zustandState.user.logout).toHaveBeenCalledWith()
    })

    describe('Download Status and History link', () => {
      test('adds the ee param if the earthdataEnvironment is different than the deployed environment', async () => {
        const { user } = setup({
          overrideZustandState: {
            user: {
              edlToken: 'fakeauthkey',
              ursProfile: {
                firstName: 'First Name'
              }
            },
            earthdataEnvironment: {
              currentEnvironment: 'uat'
            }
          }
        })

        const usermenuButton = screen.queryByRole('button', { name: 'First Name' })
        await user.click(usermenuButton)

        const downloadStatusButton = screen.getByRole('link', { name: 'Download Status & History' })
        expect(downloadStatusButton.href).toMatch('downloads?ee=uat')
      })

      test('does not add the ee param if the earthdataEnvironment is the deployed environment', async () => {
        const { user } = setup({
          overrideZustandState: {
            user: {
              edlToken: 'fakeauthkey',
              ursProfile: {
                firstName: 'First Name'
              }
            }
          }
        })

        const usermenuButton = screen.getByRole('button', { name: 'First Name' })
        await user.click(usermenuButton)

        const downloadStatusButton = screen.getByRole('link', { name: 'Download Status & History' })
        expect(downloadStatusButton.href).toMatch('downloads')
      })
    })
  })

  describe('#handleKeypress', () => {
    test('calls stopPropagation and preventDefault on Enter press', async () => {
      const { user } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const myProjectButton = await screen.findByRole('button', { name: 'Save Project' })
      await user.click(myProjectButton)

      const projectNameField = await screen.findByPlaceholderText('Untitled Project')
      expect(projectNameField).toBeInTheDocument()

      await user.type(projectNameField, 'test project name')

      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault')
      const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation')

      await user.type(projectNameField, '{Enter}')

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1)
      expect(preventDefaultSpy).toHaveBeenCalledWith()

      expect(stopPropagationSpy).toHaveBeenCalledTimes(1)
      expect(stopPropagationSpy).toHaveBeenCalledWith()
    })

    test('does not call stopPropagation and preventDefault on a non-\'Enter\' press', async () => {
      const { user } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const myProjectButton = screen.getByRole('button', { name: 'Save Project' })
      await user.click(myProjectButton)

      const projectNameField = screen.getByPlaceholderText('Untitled Project')
      expect(projectNameField).toBeInTheDocument()

      await user.type(projectNameField, 'test project name')

      const preventDefaultSpy = vi.spyOn(Event.prototype, 'preventDefault')
      const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation')

      await user.type(projectNameField, '{space}')

      expect(preventDefaultSpy).toHaveBeenCalledTimes(0)
      expect(stopPropagationSpy).toHaveBeenCalledTimes(0)
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
        setup({
          overrideZustandState: {
            project: {
              collections: {
                allIds: ['123']
              }
            }
          }
        })

        expect(screen.getByRole('button', { name: 'My Project' })).toBeInTheDocument()
      })
    })

    test('hovering over My Project renders a tool-tip', async () => {
      const { user } = setup({
        overrideZustandState: {
          project: {
            collections: {
              allIds: ['123']
            }
          }
        }
      })

      await user.hover(screen.getByRole('button', { name: 'My Project' }))

      expect(await screen.findByText('View your project')).toBeVisible()
    })
  })

  describe('Back to Project button', () => {
    describe('when not on the downloads page', () => {
      test('does not show the Back to Project button', () => {
        setup({
          overrideZustandState: {
            user: {
              edlToken: 'fakeauthkey',
              ursProfile: {
                firstName: 'First Name'
              }
            }
          }
        })

        expect(screen.queryByText('Back to Project')).not.toBeInTheDocument()
      })
    })

    describe('when on the downloads page', () => {
      afterEach(() => {
        useLocation.mockReturnValue({
          pathname: '/search'
        })

        useParams.mockReturnValue({})
      })

      test('shows the Back to Project button', async () => {
        useLocation.mockReturnValue({
          pathname: '/downloads/12345'
        })

        useParams.mockReturnValue({
          id: '12345'
        })

        setup({
          overrideZustandState: {
            user: {
              edlToken: 'fakeauthkey',
              ursProfile: {
                firstName: 'First Name'
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: GET_RETRIEVAL,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrieval: {
                  id: 'mock-id',
                  obfuscatedId: '12345',
                  retrievalCollections: [],
                  jsondata: {
                    source: '?p=!collectionId'
                  }
                }
              }
            }
          }]
        })

        expect(await screen.findByText('Back to Project')).toBeInTheDocument()

        expect(PortalLinkContainer).toHaveBeenCalledTimes(3)

        // The first two calls don't have the `to` populated because the request hasn't finished
        expect(PortalLinkContainer).toHaveBeenNthCalledWith(3, {
          bootstrapVariant: 'light',
          children: 'Back to Project',
          className: 'secondary-toolbar__back focus-light',
          icon: expect.any(Function),
          label: 'Back to Project',
          to: {
            pathname: '/project',
            search: '?p=!collectionId'
          },
          type: 'button',
          updatePath: true
        }, {})
      })
    })
  })

  describe('Project name dropdown', () => {
    test('does not display the project dropdown on the projects page', () => {
      setup({
        overrideProps: {
          location: {
            pathname: '/project'
          }
        }
      })

      const myProjectButton = screen.queryByRole('button', { name: 'Save Project' })
      expect(myProjectButton).not.toBeInTheDocument()
    })

    test('clicking the save project dropdown sets the state', async () => {
      const { user } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })
      await user.click(saveProjectButton)

      const projectNameField = screen.getByPlaceholderText('Untitled Project')
      expect(projectNameField).toBeInTheDocument()
    })

    test('hovering over saved project renders the tool-tip', async () => {
      const { user } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })
      await user.hover(saveProjectButton)

      expect(await screen.findByText('Create a project with your current search')).toBeVisible()
    })

    test('clicking the save button sets the state and calls setProjectName', async () => {
      const { user, zustandState } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'fakeauthkey',
            ursProfile: {
              firstName: 'First Name'
            }
          }
        }
      })

      const saveProjectButton = screen.getByRole('button', { name: 'Save Project' })
      await user.click(saveProjectButton)

      const projectNameField = screen.getByPlaceholderText('Untitled Project')
      expect(projectNameField).toBeInTheDocument()

      await user.type(projectNameField, 'test project name')

      const saveProjectNameButton = screen.getByRole('button', { name: 'Save project name' })
      await user.click(saveProjectNameButton)

      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledTimes(1)
      expect(zustandState.savedProject.setProjectName).toHaveBeenCalledWith('test project name')
    })
  })

  test('renders the login button under PortalFeatureContainer', () => {
    setup()

    const portalContainer = screen.getByTestId('mockPortalFeatureContainer')
    const loginButton = within(portalContainer).getByRole('button', { name: 'Log In' })

    expect(loginButton).toBeInTheDocument()
  })

  describe('adding classname for map view', () => {
    test('when not in map view page', () => {
      setup('loggedIn', {
        location: {
          pathname: '/project'
        }
      })

      const secondaryToolbar = screen.getByRole('navigation')
      const portalFeatureContainer = within(secondaryToolbar).getByTestId('mockPortalFeatureContainer')

      expect(portalFeatureContainer).toBeInTheDocument()
    })

    test('when in map view page', () => {
      setup('loggedIn', {
        location: {
          pathname: '/search'
        }
      })

      const secondaryToolbar = screen.getByRole('navigation')
      expect(secondaryToolbar).toHaveClass('secondary-toolbar', 'secondary-toolbar--map-overlay')
    })
  })

  describe('when navigating the Search Tour from the secondary toolbar', () => {
    // Tour functionality is being tested in tour.spec.js
    describe('while the user is logged out', () => {
      test('tour button renders', () => {
        setup()

        const tourButton = screen.getByRole('button', { name: 'Start tour' })

        expect(tourButton).toBeInTheDocument()
      })
    })

    describe('while the user is logged in', () => {
      test('tour button renders', () => {
        setup({
          overrideZustandState: {
            user: {
              edlToken: 'fakeauthkey',
              ursProfile: {
                firstName: 'First Name'
              }
            }
          }
        })

        const tourButton = screen.getByRole('button', { name: 'Start tour' })

        expect(tourButton).toBeInTheDocument()
      })
    })

    test('hovering over the tour renders a tool-tip', async () => {
      const { user } = setup()

      const tourButton = screen.getByRole('button', { name: 'Start tour' })
      await user.hover(tourButton)

      expect(await screen.findByText('Take a tour to learn how to use Earthdata Search')).toBeVisible()
    })
  })
})
