import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Bannner from '../Banner'

function setup(overrideProps = {}) {
  const props = {
    title: 'title',
    message: 'message',
    onClose: jest.fn(),
    type: 'error',
    ...overrideProps
  }

  render(<Bannner {...props} />)

  return {
    props
  }
}

describe('Bannner component', () => {
  test('should render self', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Banner Title' })).toHaveTextContent('title')

    expect(screen.getByRole('paragraph', { name: 'Banner Message' })).toHaveTextContent('message')

    expect(screen.getByRole('img', { name: 'High Alert Icon' })).toBeInTheDocument()
  })

  test('clicking the close button calls onClose', async () => {
    const user = userEvent.setup()
    const { props } = setup()

    const closeBtn = screen.getByRole('button', { name: 'close' })
    await user.click(closeBtn)

    expect(props.onClose).toBeCalledTimes(1)
  })

  test('error banner should render correctly', () => {
    setup()

    expect(screen.getByRole('banner', { name: 'Banner' })).toHaveClass('banner--error')
  })

  test('does not render a message when no message was provided', async () => {
    setup({
      message: undefined
    })

    expect(screen.queryByText('message')).not.toBeInTheDocument()
  })
})
