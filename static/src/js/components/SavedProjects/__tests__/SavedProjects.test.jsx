import React from 'react'
import { screen } from '@testing-library/react'

import { SavedProjects } from '../SavedProjects'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock(
  '../../../containers/PortalLinkContainer/PortalLinkContainer',
  () => ({
    __esModule: true,
    default: ({ to, onClick, children }) => (
      <a href={to} onClick={onClick}>
        {children}
      </a>
    )
  })
)

const setup = setupTest({
  Component: SavedProjects,
  defaultProps: {
    projects: [],
    isLoading: false,
    isLoaded: false,
    earthdataEnvironment: 'uat',
    onChangePath: jest.fn(),
    onDeleteProject: jest.fn()
  }
})

describe('SavedProjects component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When the projects are loading', () => {
    test('shows a loading state', () => {
      setup({
        overrideProps: {
          isLoading: true
        }
      })

      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('saved-projects__spinner')
    })
  })

  describe('When loaded with zero projects', () => {
    test('renders empty-state message and no table', () => {
      setup({
        overrideProps: {
          isLoaded: true
        }
      })

      expect(screen.getByText('No saved projects to display.')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('When loaded with one project', () => {
    const project = {
      id: '8069076',
      name: 'test project',
      path: '/search?p=!C123456-EDSC',
      created_at: '2019-08-25T11:58:14.390Z'
    }

    test('renders a table when a saved project exists with one collection', () => {
      setup({
        overrideProps: {
          isLoaded: true,
          projects: [project]
        }
      })

      const link = screen.getByRole('link', { name: 'test project' })
      expect(link).toHaveTextContent('test project')
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('?projectId=8069076')
      )
    })

    test('renders the correct collection count and time-created cell', () => {
      setup({
        overrideProps: {
          isLoaded: true,
          projects: [project]
        }
      })

      expect(screen.getByText('1 Collection')).toBeInTheDocument()
      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })
  })

  describe('When deleting a project', () => {
    const project = {
      id: '8069076',
      name: 'test project',
      path: '/search?p=!C123456-EDSC',
      created_at: '2019-08-25T11:58:14.390Z'
    }

    test('calls onDeleteProject when delete button is clicked', async () => {
      const mockOnDeleteProject = jest.fn()

      const { user } = setup({
        overrideProps: {
          isLoaded: true,
          projects: [project],
          onDeleteProject: mockOnDeleteProject
        }
      })

      const deleteButton = screen.getByRole('button', {
        name: /remove project/i
      })

      await user.click(deleteButton)
      expect(mockOnDeleteProject).toHaveBeenCalledWith('8069076')
    })
  })
})
