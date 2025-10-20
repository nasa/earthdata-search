import React from 'react'
import { screen } from '@testing-library/react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import setupTest from '../../../../../jestConfigs/setupTest'
import { GraphQlProvider } from '../GraphQlProvider'

jest.mock('@apollo/client', () => ({
  ApolloProvider: jest.fn(({ children }) => <div>{children}</div>),
  ApolloClient: jest.fn().mockImplementation(),
  InMemoryCache: jest.fn().mockImplementation(),
  createHttpLink: jest.fn().mockReturnValue('httpLink'),
  ApolloLink: {
    from: jest.fn().mockImplementation((links) => links)
  }
}))

jest.mock('@apollo/client/link/context', () => ({
  setContext: jest.fn().mockReturnValue('authLink')
}))

jest.mock('../../../../../sharedUtils/config', () => ({
  ...jest.requireActual('../../../../../sharedUtils/config'),
  getEnvironmentConfig: jest.fn().mockReturnValue({
    apiHost: 'http://test.com'
  })
}))

const setup = setupTest({
  Component: GraphQlProvider,
  defaultProps: {
    authToken: 'Bearer token',
    children: <div>Child Component</div>
  }
})

describe('GraphQlProvider', () => {
  let rerender

  beforeEach(() => {
    ({ rerender } = setup())
  })

  test('creates an ApolloClient and renders the children', () => {
    expect(createHttpLink).toHaveBeenCalledTimes(1)
    expect(createHttpLink).toHaveBeenCalledWith({
      uri: 'http://test.com/graphql'
    })

    expect(ApolloClient).toHaveBeenCalledTimes(1)
    expect(ApolloClient).toHaveBeenCalledWith({
      cache: expect.any(InMemoryCache),
      link: [
        'authLink',
        'httpLink'
      ]
    })

    expect(ApolloProvider).toHaveBeenCalledTimes(1)
    expect(ApolloProvider).toHaveBeenCalledWith({
      children: <div>Child Component</div>,
      client: expect.any(ApolloClient)
    }, {})

    expect(screen.getByText('Child Component')).toBeInTheDocument()
  })

  describe('when rendering again with the same authToken', () => {
    test('does not create a new ApolloClient', () => {
      setup()

      expect(createHttpLink).toHaveBeenCalledTimes(0)
      expect(ApolloClient).toHaveBeenCalledTimes(0)
    })
  })

  describe('when rendering again with a different authToken', () => {
    test('creates a new ApolloClient', () => {
      jest.clearAllMocks()

      rerender(
        <GraphQlProvider authToken="Bearer newToken">
          <div>Child Component</div>
        </GraphQlProvider>
      )

      expect(ApolloClient).toHaveBeenCalledTimes(1)
      expect(ApolloClient).toHaveBeenCalledWith({
        cache: expect.any(InMemoryCache),
        link: [
          'authLink',
          'httpLink'
        ]
      })
    })
  })
})
