import { screen, waitFor } from '@testing-library/react'
import { gql } from '@apollo/client'
import AdminProjectDetails from '../AdminProjectDetails'
import setupTest from '../../../../../../jestConfigs/setupTest'
import ADMIN_PROJECT from '../../../operations/queries/adminProject'

const setup = setupTest({
  ComponentsByRoute: {
    '/admin/projects/:obfuscatedId': AdminProjectDetails
  },
  defaultApolloClientMocks: [
    {
      request: {
        query: gql(ADMIN_PROJECT),
        variables: {
          params: {
            obfuscatedId: '06347346'
          }
        }
      },
      result: {
        data: {
          adminProject: {
            id: '1',
            name: 'test project',
            obfuscatedId: '06347346',
            path: '/search?ff=Map%20Imagery',
            user: {
              id: 'test-ursid',
              ursId: 'edsc-test'
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z'
          }
        }
      }
    }
  ],
  defaultRouterEntries: ['/admin/projects/06347346'],
  withApolloClient: true,
  withRouter: true
})

describe('AdminProjectDetails component', () => {
  test('should render the site AdminProjectDetails', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByText('test project')).toBeInTheDocument()
    })

    expect(screen.getByRole('definition', { name: 'Name' })).toHaveTextContent('test project')
    expect(screen.getByRole('definition', { name: 'Owner' })).toHaveTextContent('edsc-test')
    expect(screen.getByRole('definition', { name: 'Obfuscated ID' })).toHaveTextContent('06347346')
    expect(screen.getByRole('definition', { name: 'Source Path' })).toHaveTextContent('/search?ff=Map%20Imagery')
    expect(screen.getByRole('link', { name: '/search?ff=Map%20Imagery' })).toBeInTheDocument()
    expect(screen.getByRole('definition', { name: 'Parsed Path' })).toHaveTextContent('{ "ff": "Map Imagery" }')
  })
})
