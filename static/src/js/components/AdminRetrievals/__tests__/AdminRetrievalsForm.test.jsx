import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminRetrievalsForm from '../AdminRetrievalsForm'

const setup = setupTest({
  Component: AdminRetrievalsForm,
  defaultProps: {
    onAdminViewRetrieval: jest.fn()
  }
})

describe('AdminRetrievals component', () => {
  describe('when the form is submitted', () => {
    test('calls the onAdminViewRetrieval prop with the retrieval ID', async () => {
      const { props, user } = setup()

      const retrievalId = '1109324645'

      const input = screen.getByPlaceholderText('Obfuscated Retrieval ID')
      await user.type(input, retrievalId)

      const button = screen.getByRole('button', { name: 'Go' })
      await user.click(button)

      expect(props.onAdminViewRetrieval).toHaveBeenCalledTimes(1)
      expect(props.onAdminViewRetrieval).toHaveBeenCalledWith(retrievalId)
    })
  })
})
