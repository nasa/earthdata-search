import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import RedirectingAuthState from '../RedirectingAuthState'

const setup = setupTest({
  Component: RedirectingAuthState
})

describe('RedirectingAuthState component', () => {
  test('renders the default message and spinner by default', () => {
    setup()

    expect(screen.getByText(/Redirecting to sign in/i)).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
