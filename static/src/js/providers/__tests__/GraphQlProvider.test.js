import React from 'react'
import { screen } from '@testing-library/react'
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'
import setupTest from '../../../../../jestConfigs/setupTest'
import GraphQlProvider from '../GraphQlProvider'
import * as config from '../../../../../sharedUtils/config'

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

jest.spyOn(config, 'getEnvironmentConfig').mockImplementation(() => ({
  apiHost: 'http://test.com'
}))

const setup = setupTest({
  Component: GraphQlProvider,
  withRedux: true,
  defaultProps: {
    authToken: 'Bearer token',
    children: <div>Child Component</div>
  }
})

describe('GraphQlProvider', () => {
  test('renders the children', () => {
    setup()
    expect(screen.getByText('Child Component')).toBeInTheDocument()
  })

  test('create the httpLink with the correct uri', () => {
    setup()
    expect(createHttpLink).toHaveBeenCalledTimes(1)
    expect(createHttpLink).toHaveBeenCalledWith({
      uri: 'http://test.com/graphql'
    })
  })

  test('initializes the client', () => {
    setup()
    expect(ApolloClient).toHaveBeenCalledTimes(1)
    expect(ApolloClient).toHaveBeenCalledWith({
      cache: expect.any(InMemoryCache),
      link: [
        'authLink',
        'httpLink'
      ]
    })
  })

  test('sets the client as expected', () => {
    setup()
    expect(ApolloProvider).toHaveBeenCalledTimes(1)
    expect(ApolloProvider).toHaveBeenCalledWith({
      children: <div>Child Component</div>,
      client: expect.any(ApolloClient)
    }, {})
  })
})
