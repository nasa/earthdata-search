import React from 'react'
import { act, screen } from '@testing-library/react'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache
} from '@apollo/client'
import setupTest from '../../../../../jestConfigs/setupTest'
import GraphQlProvider from '../GraphQlProvider'
import useEdscStore from '../../zustand/useEdscStore'

jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client')

  return {
    ...actual,
    ApolloProvider: jest.fn(({ children }) => <div>{children}</div>),
    ApolloClient: jest.fn().mockImplementation()
  }
})

jest.mock('../../../../../sharedUtils/config', () => ({
  ...jest.requireActual('../../../../../sharedUtils/config'),
  getEnvironmentConfig: jest.fn().mockReturnValue({
    apiHost: 'http://test.com/api',
    cmrHost: 'http://test.com/cmr',
    graphQlHost: 'http://test.com/graphql'
  })
}))

const setup = setupTest({
  Component: GraphQlProvider,
  defaultProps: {
    children: <div>Child Component</div>
  },
  defaultZustandState: {
    user: {
      edlToken: 'token'
    }
  }
})

describe('GraphQlProvider', () => {
  beforeEach(() => {
    setup()
  })

  test('creates an ApolloClient and renders the children', () => {
    expect(ApolloClient).toHaveBeenCalledTimes(1)
    expect(ApolloClient).toHaveBeenCalledWith({
      cache: expect.any(InMemoryCache),
      link: expect.any(ApolloLink)
    })

    expect(ApolloProvider).toHaveBeenCalledTimes(1)
    expect(ApolloProvider).toHaveBeenCalledWith({
      children: <div>Child Component</div>,
      client: expect.any(ApolloClient)
    }, {})

    expect(screen.getByText('Child Component')).toBeInTheDocument()
  })

  describe('when rendering again with the same edlToken', () => {
    test('does not create a new ApolloClient', () => {
      setup()

      expect(ApolloClient).toHaveBeenCalledTimes(0)
    })
  })

  describe('when rendering again with a different edlToken', () => {
    test('creates a new ApolloClient', async () => {
      jest.clearAllMocks()

      // Update the edlToken in the store
      await act(async () => {
        useEdscStore.setState((state) => {
          // eslint-disable-next-line no-param-reassign
          state.user.edlToken = 'newToken'
        })
      })

      expect(ApolloClient).toHaveBeenCalledTimes(1)
      expect(ApolloClient).toHaveBeenCalledWith({
        cache: expect.any(InMemoryCache),
        link: expect.any(ApolloLink)
      })
    })
  })
})
