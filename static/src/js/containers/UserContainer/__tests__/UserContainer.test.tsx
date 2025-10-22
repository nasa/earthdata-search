import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { gql } from '@apollo/client'
import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../jestConfigs/setupTest'

import {
  mapDispatchToProps,
  mapStateToProps,
  UserContainer
} from '../UserContainer'
import GET_USER from '../../../operations/queries/getUser'

// @ts-expect-error The file does not have types
import actions from '../../../actions/index'

jest.mock('tiny-cookie', () => ({
  remove: jest.fn().mockReturnValue('')
}))

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

const setup = setupTest({
  Component: UserContainer,
  defaultProps: {
    authToken: '',
    children: <div>Child Component</div>,
    onHandleError: jest.fn(),
    onUpdateAuthToken: jest.fn(),
    onUpdateContactInfo: jest.fn()
  },
  defaultZustandState: {
    user: {
      setSitePreferences: jest.fn(),
      setUsername: jest.fn()
    }
  },
  withApolloClient: true,
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onHandleError calls actions.handleError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'handleError')

    mapDispatchToProps(dispatch).onHandleError({ mock: 'error' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'error' })
  })

  test('onUpdateAuthToken calls actions.updateAuthToken', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAuthToken')

    mapDispatchToProps(dispatch).onUpdateAuthToken('test-token')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('test-token')
  })

  test('onUpdateContactInfo calls actions.updateContactInfo', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateContactInfo')

    mapDispatchToProps(dispatch).onUpdateContactInfo({
      ursProfile: {
        email_address: 'test@example.com'
      }
    })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({
      ursProfile: {
        email_address: 'test@example.com'
      }
    })
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      authToken: 'test-auth-token'
    }

    const expectedState = {
      authToken: 'test-auth-token'
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('UserContainer', () => {
  test('renders child components when no authToken is provided', () => {
    setup()

    expect(screen.getByText('Child Component')).toBeInTheDocument()
  })

  describe('when an authToken and user data are provided', () => {
    test('does not render child components', () => {
      setup({
        overrideProps: {
          authToken: 'test-auth-token'
        },
        overrideApolloClientMocks: [{
          request: {
            query: gql(GET_USER)
          },
          result: {
            data: {
              user: null
            }
          }
        }]
      })

      expect(screen.queryByText('Child Component')).not.toBeInTheDocument()
    })
  })

  describe('when an authToken and user data are provided', () => {
    test('updates store and renders child components', async () => {
      const { props, zustandState } = setup({
        overrideProps: {
          authToken: 'test-auth-token'
        },
        overrideApolloClientMocks: [{
          request: {
            query: gql(GET_USER)
          },
          result: {
            data: {
              user: {
                id: '123',
                sitePreferences: {},
                ursId: 'test-user',
                ursProfile: {}
              }
            }
          }
        }]
      })

      expect(await screen.findByText('Child Component')).toBeInTheDocument()

      expect(props.onUpdateContactInfo).toHaveBeenCalledTimes(1)
      expect(props.onUpdateContactInfo).toHaveBeenCalledWith({ ursProfile: {} })

      expect(zustandState.user.setSitePreferences).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setSitePreferences).toHaveBeenCalledWith({})

      expect(zustandState.user.setUsername).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setUsername).toHaveBeenCalledWith('test-user')
    })
  })

  describe('when the getUser query returns an error', () => {
    test('handles the error, removes the authToken, and redirects to /search', async () => {
      const removeSpy = jest.spyOn(tinyCookie, 'remove')

      const { props } = setup({
        overrideProps: {
          authToken: 'test-auth-token'
        },
        overrideApolloClientMocks: [{
          request: {
            query: gql(GET_USER)
          },
          error: new Error('Test error')
        }]
      })

      await waitFor(() => {
        expect(props.onUpdateAuthToken).toHaveBeenCalledTimes(1)
      })

      expect(props.onUpdateAuthToken).toHaveBeenCalledWith('')

      expect(removeSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledWith('authToken')

      expect(props.onHandleError).toHaveBeenCalledTimes(1)
      expect(props.onHandleError).toHaveBeenCalledWith({
        error: expect.any(Error),
        action: 'getUser query',
        title: 'Something went wrong while logging in'
      })

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith('/search?ee=prod', { replace: true })
    })
  })
})
