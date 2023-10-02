import React from 'react'
import { act } from 'react-dom/test-utils'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import '@testing-library/jest-dom'

import usePortalLogo from '../usePortalLogo'

jest.mock('../../../../../portals/podaac/images/logo.png', () => ('podaac_logo_path'))
jest.mock('../../../../../portals/soos/images/logo.png', () => ('soos_logo_path'))

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
      act(() => {
        render(<TestComponent />)
      })

      await waitFor(() => {
        expect(screen.getByTestId('test-component').textContent).toEqual('')
      })
    })
  })

  describe('when a portal is provided', () => {
    describe('when the portal does not exist', () => {
      test('does not generate a src', async () => {
        act(() => {
          render(<TestComponent portalId="invalid" />)
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('')
        })
      })
    })

    describe('when the portalId does not exist', () => {
      test('does not generate a src', async () => {
        act(() => {
          render(<TestComponent portalId="test" />)
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('')
        })
      })
    })

    describe('when the portal exists', () => {
      test('adds the correct src', async () => {
        act(() => {
          render(<TestComponent portalId="soos" />)
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('soos_logo_path')
        })
      })
    })

    describe('when the portal exists and has already been cached', () => {
      test('adds the correct src', async () => {
        // TODO Figure out if we can mock/spy on the import to see how many times its called
        let rerender
        act(() => {
          ({ rerender } = render(<TestComponent portalId="soos" />))
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('soos_logo_path')
        })

        act(() => {
          rerender(<TestComponent portalId="podaac" />)
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('podaac_logo_path')
        })

        act(() => {
          rerender(<TestComponent portalId="soos" />)
        })

        await waitFor(() => {
          expect(screen.getByTestId('test-component').textContent).toEqual('soos_logo_path')
        })
      })
    })
  })
})
