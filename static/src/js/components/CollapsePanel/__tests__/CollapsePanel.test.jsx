import React from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'
import { CollapsePanel } from '../CollapsePanel'

const setup = () => {
  const user = userEvent.setup()
  const props = {
    buttonClassName: 'test-button-class',
    className: 'test-wrap-class',
    children: <div className="test-child-wrap">Im a child!</div>,
    header: 'test-header-text',
    panelClassName: 'test-panel-class'
  }

  const { container } = render(<CollapsePanel {...props} />)

  return {
    container,
    props,
    user

  }
}

describe('CollapsePanel component', () => {
  test('renders itself correctly', () => {
    setup()
    expect(screen.getByTestId('collapse-panel')).toHaveClass('collapse-panel test-wrap-class')
  })

  test('renders it children correctly', () => {
    setup()
    expect(screen.getByText('Im a child!')).toBeInTheDocument()
  })

  test('renders its button correctly', async () => {
    const { user } = setup()
    const openPanelButton = screen.getByRole('button', { name: 'Open Panel' })

    await user.click(openPanelButton)

    expect(screen.getByText('test-header-text')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close Panel' })).toBeInTheDocument()
  })

  test('toggles when clicked', async () => {
    const { user } = setup()
    const openPanelButton = screen.getByRole('button', { name: 'Open Panel' })
    expect(screen.getByTitle('ArrowChevronDown')).toBeInTheDocument()

    await user.click(openPanelButton)
    expect(screen.getByTitle('ArrowChevronUp')).toBeInTheDocument()
  })
})
