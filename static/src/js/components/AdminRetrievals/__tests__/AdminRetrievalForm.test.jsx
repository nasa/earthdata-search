import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import { AdminRetrievalsForm } from '../AdminRetrievalsForm'

const setup = setupTest({
  Component: AdminRetrievalsForm,
  defaultProps: {
    onAdminViewRetrieval: jest.fn(),
    onFetchAdminRetrievals: jest.fn()
  }
})

describe('AdminRetrievalsForm component', () => {
  describe('when typing into the retrieval id field', () => {
    test('shows the typed text in the input', async () => {
      const { user } = setup()

      const retrievalInput = screen.getByPlaceholderText('Obfuscated Retrieval ID')
      await user.type(retrievalInput, 'test-retrieval-id')

      expect(retrievalInput).toHaveValue('test-retrieval-id')
    })
  })

  describe('when typing into the user id field', () => {
    test('shows the typed text in the input', async () => {
      const { user } = setup()

      const userIdInput = screen.getByPlaceholderText('Enter User ID')
      await user.type(userIdInput, 'test-user-id')

      expect(userIdInput).toHaveValue('test-user-id')
    })
  })

  describe('when clicking Go with user id provided', () => {
    test('calls onFetchAdminRetrievals with the user id', async () => {
      const { props, user } = setup()

      const userIdInput = screen.getByPlaceholderText('Enter User ID')
      const goButtons = screen.getAllByText('Go')

      await user.type(userIdInput, 'test-user-id')
      await user.click(goButtons[1])

      expect(props.onFetchAdminRetrievals).toHaveBeenCalledTimes(1)
      expect(props.onFetchAdminRetrievals).toHaveBeenCalledWith('test-user-id')
      expect(props.onAdminViewRetrieval).not.toHaveBeenCalled()
    })
  })

  describe('when clicking Go with retrieval id provided', () => {
    test('calls onAdminViewRetrieval with the retrieval id', async () => {
      const { props, user } = setup()

      const retrievalInput = screen.getByPlaceholderText('Obfuscated Retrieval ID')
      const goButtons = screen.getAllByText('Go')

      await user.type(retrievalInput, 'test-retrieval-id')
      await user.click(goButtons[0])

      expect(props.onAdminViewRetrieval).toHaveBeenCalledTimes(1)
      expect(props.onAdminViewRetrieval).toHaveBeenCalledWith('test-retrieval-id')
      expect(props.onFetchAdminRetrievals).not.toHaveBeenCalled()
    })
  })
})
