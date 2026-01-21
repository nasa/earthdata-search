import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import * as tinyCookie from 'tiny-cookie'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import UserLoader from '../UserLoader'
import GET_USER from '../../../operations/queries/getUser'

import Spinner from '../../Spinner/Spinner'

import { localStorageKeys } from '../../../constants/localStorageKeys'

vi.mock('../../../components/Spinner/Spinner', () => ({
  default: vi.fn(() => <div />)
}))

vi.mock('tiny-cookie', () => ({
  remove: vi.fn().mockReturnValue('')
}))

const mockUseNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockUseNavigate
}))

const setup = setupTest({
  Component: UserLoader,
  defaultProps: {
    children: <div>Child Component</div>
  },
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
    },
    user: {
      setEdlToken: vi.fn(),
      setSitePreferences: vi.fn(),
      setUrsProfile: vi.fn(),
      setUsername: vi.fn()
    }
  },
  withApolloClient: true,
  withRouter: true
})

describe('UserLoader', () => {
  test('renders child components when no edlToken is provided', () => {
    const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem')

    setup()

    expect(screen.getByText('Child Component')).toBeInTheDocument()

    expect(localStorageGetItemSpy).toHaveBeenCalledTimes(0)
  })

  describe('when an edlToken and no user data are provided', () => {
    test('renders a spinner', () => {
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

      setup({
        overrideZustandState: {
          user: {
            edlToken: 'test-auth-token'
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_USER
          },
          result: {
            data: {
              user: null
            }
          }
        }]
      })

      expect(screen.queryByText('Child Component')).not.toBeInTheDocument()

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        className: 'root__spinner spinner spinner--dots spinner--small',
        type: 'dots'
      }, {})

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith(localStorageKeys.user)
    })
  })

  describe('when localstorage has user data', () => {
    test('restores user data from localstorage', () => {
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify({
        sitePreferences: {
          mock: 'preferences'
        },
        ursProfile: {
          firstName: 'test'
        }
      }))

      const { zustandState } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'test-auth-token'
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_USER
          },
          result: {
            data: {
              user: {
                id: '123',
                sitePreferences: {},
                ursId: 'test-user',
                ursProfile: {
                  affiliation: 'Test University',
                  country: 'Test Country',
                  emailAddress: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  organization: 'Test Organization',
                  studyArea: 'Test Area',
                  uid: 'test-uid',
                  userType: 'Test Type'
                }
              }
            }
          }
        }]
      })

      // Renders the child component without waiting for the query
      expect(screen.getByText('Child Component')).toBeInTheDocument()

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith(localStorageKeys.user)

      expect(zustandState.user.setSitePreferences).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setSitePreferences).toHaveBeenCalledWith({
        mock: 'preferences'
      })

      expect(zustandState.user.setUrsProfile).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setUrsProfile).toHaveBeenCalledWith({
        firstName: 'test'
      })
    })
  })

  describe('when an edlToken and user data are provided', () => {
    test('updates store and renders child components', async () => {
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)

      const { zustandState } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'test-auth-token'
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_USER
          },
          result: {
            data: {
              user: {
                id: '123',
                sitePreferences: {},
                ursId: 'test-user',
                ursProfile: null
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Child Component')).toBeInTheDocument()

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith(localStorageKeys.user)

      expect(zustandState.user.setUrsProfile).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setUrsProfile).toHaveBeenCalledWith(null)

      expect(zustandState.user.setSitePreferences).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setSitePreferences).toHaveBeenCalledWith({})

      expect(zustandState.user.setUsername).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setUsername).toHaveBeenCalledWith('test-user')
    })
  })

  describe('when the getUser query returns an error', () => {
    test('handles the error, removes the edlToken, and redirects to /search', async () => {
      const removeSpy = vi.spyOn(tinyCookie, 'remove')
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
      const localStorageRemoveItemSpy = vi.spyOn(Storage.prototype, 'removeItem')

      const { zustandState } = setup({
        overrideZustandState: {
          user: {
            edlToken: 'test-auth-token'
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_USER
          },
          error: new ApolloError({ errorMessage: 'Test error' })
        }]
      })

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith(localStorageKeys.user)

      await waitFor(() => {
        expect(zustandState.user.setEdlToken).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.user.setEdlToken).toHaveBeenCalledWith(null)

      expect(removeSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledWith('edlToken')

      expect(localStorageRemoveItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith(localStorageKeys.user)

      expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        error: new ApolloError({ errorMessage: 'Test error' }),
        action: 'getUser query',
        title: 'Something went wrong while logging in'
      })

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith('/search?ee=prod', { replace: true })
    })
  })
})
