import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as config from '../../../../../../sharedUtils/config'

import { mapStateToProps, FooterContainer } from '../FooterContainer'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

const setup = setupTest({
  Component: FooterContainer,
  defaultProps: {
    earthdataEnvironment: 'prod',
    loadTime: 2.2,
    portal: {
      footer: {
        attributionText: 'Mock text',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://primary.example.com',
          title: 'Primary Example'
        }],
        secondaryLinks: [{
          href: 'http://secondary.example.com',
          title: 'Secondary Example',
          secondary: true
        }]
      }
    }
  },
  defaultZustandState: {
    portal: {
      footer: {
        attributionText: 'Mock text',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://primary.example.com',
          title: 'Primary Example'
        }],
        secondaryLinks: [{
          href: 'http://secondary.example.com',
          title: 'Secondary Example',
          secondary: true
        }]
      }
    }
  },
  withRedux: true
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      searchResults: {
        collections: {
          loadTime: ''
        }
      }
    }

    const expectedState = {
      loadTime: ''
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('FooterContainer component', () => {
  test('displays version', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    setup()

    expect(screen.getByText('v2.0.0')).toBeInTheDocument()
  })

  test('does not display version if portal has it disabled', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    setup({
      overrideZustandState: {
        portal: {
          footer: {
            displayVersion: false
          }
        }
      }
    })

    expect(screen.queryByText('v2.0.0')).not.toBeInTheDocument()
  })

  test('displays attribution text', () => {
    setup()

    expect(screen.getByText('Mock text')).toBeInTheDocument()
  })

  test('displays primary links', () => {
    setup()

    const link = screen.getByRole('link', { name: 'Primary Example' })
    expect(link).toBeInTheDocument()
    expect(link.href).toEqual('http://primary.example.com/')
  })

  test('displays secondary links', () => {
    setup()

    const link = screen.getByRole('link', { name: 'Secondary Example' })
    expect(link).toBeInTheDocument()
    expect(link.href).toEqual('http://secondary.example.com/')
  })

  describe('when in the prod environment', () => {
    test('does not display the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod',
        version: '2.0.0'
      }))

      setup()

      expect(screen.queryByText('prod')).not.toBeInTheDocument()
    })
  })

  describe('when in a test environment', () => {
    test('displays the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'UAT',
        version: '2.0.0'
      }))

      setup()

      expect(screen.getByText('UAT')).toBeInTheDocument()
    })
  })
})
