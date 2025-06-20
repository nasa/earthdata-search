import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AdminRetrievalsForm } from '../AdminRetrievalsForm'

const setup = () => {
  const user = userEvent.setup()

  const props = {
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn()
  }

  render(<AdminRetrievalsForm {...props} />)

  return {
    props,
    user
  }
}

describe('AdminRetrievalsForm component', () => {
  test('renders itself correctly', () => {
    setup()
  })

  test('onInputChange updates state', async () => {
    const { user } = setup()

    const retrievalInput = screen.getByPlaceholderText('Obfuscated Retrieval ID')
    await user.type(retrievalInput, 'test-retrieval-id')
    expect(retrievalInput).toHaveValue('test-retrieval-id')
  })

  test('onFormSubmit calls onFetchAdminRetrievals when userId provided', async () => {
    const { props, user } = setup()

    const userIdInput = screen.getByPlaceholderText('Enter User ID')
    const goButtons = screen.getAllByText('Go')

    await user.type(userIdInput, 'test-user-id')
    await user.click(goButtons[1])

    expect(props.onFetchAdminRetrievals).toHaveBeenCalledWith('test-user-id')
  })

  test('onFormSubmit calls onAdminViewRetrieval when only retrievalId provided', async () => {
    const { props, user } = setup()

    const retrievalInput = screen.getByPlaceholderText('Obfuscated Retrieval ID')
    const goButtons = screen.getAllByText('Go')

    await user.type(retrievalInput, 'test-retrieval-id')
    await user.click(goButtons[0])

    expect(props.onAdminViewRetrieval).toHaveBeenCalledWith('test-retrieval-id')
  })
})
