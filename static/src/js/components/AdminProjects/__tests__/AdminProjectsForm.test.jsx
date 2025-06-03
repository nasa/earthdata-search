import { screen } from '@testing-library/react'

import AdminProjectsForm from '../AdminProjectsForm'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: AdminProjectsForm,
  defaultProps: {
    onAdminViewProject: jest.fn()
  }
})

describe('AdminProjects component', () => {
  describe('when the form is submitted', () => {
    test('calls the onAdminViewProject prop with the project ID', async () => {
      const { props, user } = setup()

      const projectId = '1109324645'

      const input = screen.getByPlaceholderText('Obfuscated Project ID')
      await user.type(input, projectId)

      const button = screen.getByRole('button', { name: 'Go' })
      await user.click(button)

      expect(props.onAdminViewProject).toHaveBeenCalledTimes(1)
      expect(props.onAdminViewProject).toHaveBeenCalledWith(projectId)
    })
  })
})
