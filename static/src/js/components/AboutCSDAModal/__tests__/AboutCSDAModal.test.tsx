import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AboutCSDAModal from '../AboutCSDAModal'

function setup(overrideProps = {}) {
  const onToggleAboutCSDAModal = jest.fn()

  const props = {
    isOpen: true,
    onToggleAboutCSDAModal,
    ...overrideProps
  }

  render(<AboutCSDAModal {...props} />)

  return {
    onToggleAboutCSDAModal
  }
}

describe('AboutCSDAModal component', () => {
  test('should render a Modal', () => {
    setup()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  test('should render a title', () => {
    setup()

    expect(screen.getByText("What's the NASA Commercial Smallsat Data Acquisition (CSDA) Program?")).toBeInTheDocument()
  })

  test('should render the body', () => {
    setup()

    expect(screen.getByText(/The Commercial Smallsat Data Acquisition \(CSDA\) Program/)).toBeInTheDocument()
  })

  test('should call onToggleAboutCSDAModal when the modal is closed', async () => {
    const { onToggleAboutCSDAModal } = setup()
    const user = userEvent.setup()

    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    expect(onToggleAboutCSDAModal).toHaveBeenCalledWith(false)
  })
})
