import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'

import usePortalLogo from '../usePortalLogo'

// Use virtual mocks of modules that don't exist anywhere in the system
jest.mock('../../../../../portals/testPortal/images/logo.png', () => ('testPortal_logo_path'), { virtual: true })
jest.mock('../../../../../portals/testPortal2/images/logo.png', () => ('testPortal2_logo_path'), { virtual: true })

// eslint-disable-next-line react/prop-types
const TestComponent = ({ portalId }) => {
  const result = usePortalLogo(portalId)

  return <div data-testid="test-component">{result}</div>
}

afterEach(() => {
  jest.clearAllMocks()
  jest.resetAllMocks()
})

describe('usePortalLogo', () => {
  describe('when a portal is not provided', () => {
    test('does not generate a src', async () => {
      render(<TestComponent />)

      await waitFor(() => {
        expect(screen.getByTestId('test-component').textContent).toEqual('')
      })
    })
  })

  describe('when a portal is provided', () => {
    describe('when the portal does not exist', () => {
      test('does not generate a src', async () => {
        render(<TestComponent portalId="invalid" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('')
        })
      })
    })

    describe('when the portal exists', () => {
      test('adds the correct src', async () => {
        render(<TestComponent portalId="testPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('testPortal_logo_path')
        })
      })
    })

    describe('when the portal exists and has already been cached', () => {
      test('adds the correct src', async () => {
        const { rerender } = render(<TestComponent portalId="testPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('testPortal_logo_path')
        })

        rerender(<TestComponent portalId="testPortal2" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('testPortal2_logo_path')
        })

        rerender(<TestComponent portalId="testPortal" />)

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('testPortal_logo_path')
        })
      })
    })
  })
})
