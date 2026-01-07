import { screen } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as config from '../../../../../../sharedUtils/config'

import Footer from '../Footer'

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
  Component: Footer,
  defaultZustandState: {
    collections: {
      collections: {
        loadTime: 2200
      }
    },
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
  }
})

describe('Footer component', () => {
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

  describe('attribution', () => {
    test('displays attribution text', () => {
      setup()

      expect(screen.getByText('Mock text')).toBeInTheDocument()
    })

    test('does not display attribution when it does not exist', () => {
      setup({
        overrideZustandState: {
          portal: {
            footer: {
              attributionText: null
            }
          }
        }
      })

      expect(screen.queryByText('Mock text')).not.toBeInTheDocument()
    })
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

  describe('search time', () => {
    describe('when on the search page', () => {
      test('displays search time', () => {
        setup()

        expect(screen.getByText('Search Time: 2.2s')).toBeInTheDocument()
      })
    })

    describe('when on the project page', () => {
      test('displays search time', () => {
        useLocation.mockReturnValue({
          pathname: '/project',
          search: '?p=C1234-EDSC'
        })

        setup()

        expect(screen.getByText('Search Time: 2.2s')).toBeInTheDocument()
      })
    })

    describe('when on the granules page', () => {
      test('does not display search time', () => {
        useLocation.mockReturnValue({
          pathname: '/search/granules'
        })

        setup()

        expect(screen.queryByText('Search Time: 2.2s')).not.toBeInTheDocument()
      })
    })
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
