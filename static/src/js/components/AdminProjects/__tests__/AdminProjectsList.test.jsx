import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AdminProjectsList from '../AdminProjectsList'

const mockUseNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useNavigate: () => mockUseNavigate
}))

const projects = {
  allIds: ['1109324645'],
  byId: {
    1109324645: {
      id: 64,
      jsondata: {},
      environment: 'prod',
      created_at: '2019-08-25T11:59:14.390Z',
      user_id: 1,
      username: 'edsc-test',
      total: 40,
      obfuscated_id: '1109324645'
    }
  },
  pagination: {
    pageNum: 1,
    pageSize: 20,
    totalResults: 1
  },
  sortKey: ''
}

const setup = setupTest({
  Component: AdminProjectsList,
  defaultProps: {
    onUpdateAdminProjectsSortKey: jest.fn(),
    onUpdateAdminProjectsPageNum: jest.fn(),
    projects
  },
  withRouter: true
})

describe('AdminProjectsList component', () => {
  test('renders the collections table when collections are provided', () => {
    setup()

    const table = screen.getByRole('table')
    const rows = screen.getAllByRole('row')

    expect(table).toBeInTheDocument()
    expect(rows).toHaveLength(1)

    expect(within(table).getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Obfuscated ID' })).toBeInTheDocument()
    expect(within(table).getByRole('button', { name: 'User' })).toBeInTheDocument()
    expect(within(table).getByRole('button', { name: 'Created' })).toBeInTheDocument()

    expect(within(table).getByRole('cell', { name: '64' })).toBeInTheDocument()
    expect(within(table).getByRole('cell', { name: '1109324645' })).toBeInTheDocument()
    expect(within(table).getByRole('cell', { name: 'edsc-test' })).toBeInTheDocument()
    expect(within(table).getByRole('cell', { name: '2019-08-25T11:59:14.390Z' })).toBeInTheDocument()
  })

  describe('when clicking the User header', () => {
    test('calls the onUpdateAdminProjectsSortKey prop with -username', async () => {
      const { props, user } = setup()

      const userHeader = screen.getByRole('button', { name: 'User' })
      await user.click(userHeader)

      expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('-username')
    })

    describe('when clicking the User header when the table is sorted by -username', () => {
      test('calls the onUpdateAdminProjectsSortKey prop with +username', async () => {
        const { props, user } = setup({
          overrideProps: {
            projects: {
              ...projects,
              sortKey: '-username'
            }
          }
        })

        const userHeader = screen.getByRole('button', { name: 'User' })
        await user.click(userHeader)

        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('+username')
      })
    })

    describe('when clicking the User header when the table is sorted by +username', () => {
      test('calls the onUpdateAdminProjectsSortKey prop with no sort key', async () => {
        const { props, user } = setup({
          overrideProps: {
            projects: {
              ...projects,
              sortKey: '+username'
            }
          }
        })

        const userHeader = screen.getByRole('button', { name: 'User' })
        await user.click(userHeader)

        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('')
      })
    })
  })

  describe('when clicking the Created header', () => {
    test('calls the onUpdateAdminProjectsSortKey prop with -created_at', async () => {
      const { props, user } = setup()

      const createdHeader = screen.getByRole('button', { name: 'Created' })
      await user.click(createdHeader)

      expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('-created_at')
    })

    describe('when clicking the Created header when the table is sorted by -created_at', () => {
      test('calls the onUpdateAdminProjectsSortKey prop with +created_at', async () => {
        const { props, user } = setup({
          overrideProps: {
            projects: {
              ...projects,
              sortKey: '-created_at'
            }
          }
        })

        const createdHeader = screen.getByRole('button', { name: 'Created' })
        await user.click(createdHeader)

        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('+created_at')
      })
    })

    describe('when clicking the Created header when the table is sorted by +created_at', () => {
      test('calls the onUpdateAdminProjectsSortKey prop with no sort key', async () => {
        const { props, user } = setup({
          overrideProps: {
            projects: {
              ...projects,
              sortKey: '+created_at'
            }
          }
        })

        const createdHeader = screen.getByRole('button', { name: 'Created' })
        await user.click(createdHeader)

        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledTimes(1)
        expect(props.onUpdateAdminProjectsSortKey).toHaveBeenCalledWith('')
      })
    })
  })

  describe('when clicking next page', () => {
    test('calls the onUpdateAdminProjectsPageNum prop with the next page number', async () => {
      const { props, user } = setup({
        overrideProps: {
          projects: {
            ...projects,
            pagination: {
              pageNum: 1,
              pageSize: 1,
              totalResults: 2
            }
          }
        }
      })

      const nextPageButton = screen.getByRole('listitem', { name: 'Next Page' })
      await user.click(nextPageButton)

      expect(props.onUpdateAdminProjectsPageNum).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAdminProjectsPageNum).toHaveBeenCalledWith(2)
    })
  })

  describe('when clicking the project row', () => {
    test('navigates to the project page', async () => {
      const { user } = setup()

      const projectRow = screen.getByRole('button', {
        name: '64 1109324645 edsc-test 2019-08-25T11:59:14.390Z',
        exact: false
      })
      await user.click(projectRow)

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith('/admin/projects/1109324645')
    })
  })
})
