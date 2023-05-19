import React from 'react'
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import ButtonDropdown from '../ButtonDropdown'

const setup = () => {
  const props = {
    onClick: jest.fn(),
    buttonLabel: 'Test Label',
    buttonContent: 'Test Button Content',
    className: 'some-test-classname'
  }

  act(() => {
    render(
      <ButtonDropdown {...props}>Button Text</ButtonDropdown>
    )
  })
}

describe('ButtonDropdown component', () => {
  test('should render self', () => {
    setup()
    expect(screen.getByRole('button', { name: /test label/i })).toBeInTheDocument()
    expect(screen.queryByText('Button Text')).not.toBeInTheDocument()
  })

  test('update state when dropdown is toggled', async () => {
    setup()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Button Text')).toBeInTheDocument()
  })

  describe('icon', () => {
    test('displays correctly by default', () => {
      setup()
      expect(screen.getByTestId('dropdown-closed')).toBeInTheDocument()
    })

    test('displays correctly when opened', async () => {
      setup()
      const user = userEvent.setup()
      await user.click(screen.getByRole('button'))
      expect(screen.getByTestId('dropdown-open')).toBeInTheDocument()
    })
  })
})
