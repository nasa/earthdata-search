import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SavedProjects } from '../SavedProjects'
import ProjectRequest from '../../../util/request/projectRequest'

jest.mock('../../../util/request/projectRequest')
jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock(
  '../../../containers/PortalLinkContainer/PortalLinkContainer',
  () => ({
    __esModule: true,
    default: ({ to, onClick, children }) => (
      <a data-testid="portal-link" href={to} onClick={onClick}>
        {children}
      </a>
    )
  })
)

describe('SavedProjects component', () => {
  const props = {
    authToken: 'fake‑token',
    earthdataEnvironment: 'uat',
    onChangePath: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('When the projects are loading', () => {
    test('shows a loading state', () => {
      ProjectRequest.mockImplementation(() => ({
        all: () => new Promise(() => {}),
        remove: jest.fn()
      }))

      render(<SavedProjects {...props} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveClass('saved-projects__spinner')
    })
  })

  describe('When loaded with zero projects', () => {
    test('renders empty-state message and no table', async () => {
      ProjectRequest.mockImplementation(() => ({
        all: jest.fn().mockResolvedValue({ data: [] }),
        remove: jest.fn()
      }))

      render(<SavedProjects {...props} />)

      expect(
        await screen.findByText('No saved projects to display.')
      ).toBeInTheDocument()

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

    beforeEach(() => {
      ProjectRequest.mockImplementation(() => ({
        all: jest.fn().mockResolvedValue({ data: [project] }),
        remove: jest.fn()
      }))
    })

    test('renders a table when a saved project exists with one collection', async () => {
      render(<SavedProjects {...props} />)

      const link = await screen.findByTestId('portal-link')
      expect(link).toHaveTextContent('test project')
      expect(link).toHaveAttribute(
        'href',
        expect.stringContaining('?projectId=8069076')
      )
    })

    test('renders the correct collection count and time-created cell', async () => {
      render(<SavedProjects {...props} />)

      await screen.findByTestId('portal-link')
      expect(screen.getByText('1 Collection')).toBeInTheDocument()
      expect(screen.getByText(/ago$/)).toBeInTheDocument()
    })
  })

  describe('When deleting a project', () => {
    const project = {
      id: '8069076',
      name: 'test name',
      path: '/search?p=!C123456-EDSC',
      created_at: '2019-08-25T11:58:14.390Z'
    }
    let removeMock

    beforeEach(async () => {
      removeMock = jest.fn().mockResolvedValue({})
      ProjectRequest.mockImplementation(() => ({
        all: jest.fn().mockResolvedValue({ data: [project] }),
        remove: removeMock
      }))

      window.confirm = jest.fn(() => true)
    })

    test('calls onDeleteSavedProject', async () => {
      const view = userEvent.setup()
      render(<SavedProjects {...props} />)
      await screen.findByTestId('portal-link')

      const deleteButton = screen.getByRole('button', {
        name: /remove project/i
      })

      view.click(deleteButton)

      await waitFor(() => expect(removeMock).toHaveBeenCalledWith('8069076'))

      expect(screen.queryByTestId('portal-link')).toBeNull()
    })
  })
})
