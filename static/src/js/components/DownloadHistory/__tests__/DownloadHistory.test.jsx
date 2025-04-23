import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as AppConfig from '../../../../../../sharedUtils/config'

import { DownloadHistory } from '../DownloadHistory'

jest.mock('../../../../../../sharedUtils/deployedEnvironment', () => ({
  deployedEnvironment: jest.fn()
}))

jest.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn()
}))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => ({
  __esModule: true,
  default: ({ children, to, portalId }) => (
    <a
      href={`/downloads/${to.pathname.split('/').pop()}${to.search}`}
      data-testid="portal-link"
      data-portal-id={portalId}
    >
      {children}
    </a>
  )
}))

function setup(props) {
  return render(
    <MemoryRouter>
      <DownloadHistory {...props} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  deployedEnvironment.deployedEnvironment.mockImplementation(() => 'prod')
  AppConfig.getEnvironmentConfig.mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('DownloadHistory component', () => {
  describe('when passed the correct props', () => {
    test('renders a spinner when retrievals are loading', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [],
        retrievalHistoryLoading: true,
        retrievalHistoryLoaded: false,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('heading', { name: /download status & history/i })).toBeInTheDocument()

      const spinner = screen.getByTestId('spinner')

      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('download-history__spinner')
    })

    test('renders a message when no retrievals exist', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
      expect(screen.getByText('No download history to display.')).toBeInTheDocument()
    })

    test('renders a table when a retrieval exists with one collection that has no title', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('1 collection')).toBeInTheDocument()

      const link = screen.getByTestId('portal-link')
      expect(link).toHaveAttribute('href', '/downloads/8069076')
      expect(link).toHaveTextContent('1 collection')
    })

    test('renders a table when a retrieval exists with one collection', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Collection Title')).toBeInTheDocument()

      const link = screen.getByTestId('portal-link')
      expect(link).toHaveAttribute('href', '/downloads/8069076')
      expect(link).toHaveTextContent('Collection Title')
    })

    test('renders a table when a retrieval exists with two collections', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }, {
            title: 'Collection Title Two'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('table')).toBeInTheDocument()

      const link = screen.getByTestId('portal-link')
      expect(link).toHaveAttribute('href', '/downloads/8069076')
      expect(link).toHaveTextContent('Collection Title and 1 other collection')
    })

    test('renders document head metadata correctly', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Download Status & History')
    })

    test('renders links correctly when portals were used to place an order', () => {
      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {
            portal_id: 'test'
          },
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('table')).toBeInTheDocument()

      const link = screen.getByTestId('portal-link')
      expect(link).toHaveAttribute('href', '/downloads/8069076')
      expect(link).toHaveAttribute('data-portal-id', 'test')
      expect(link).toHaveTextContent('Collection Title')
    })

    test("renders links correctly when the earthdataEnvironment doesn't match the deployed environment", () => {
      setup({
        earthdataEnvironment: 'uat',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {
            portal_id: 'test'
          },
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval: jest.fn()
      })

      expect(screen.getByRole('table')).toBeInTheDocument()

      const link = screen.getByTestId('portal-link')
      expect(link).toHaveAttribute('href', '/downloads/8069076?ee=uat')
      expect(link).toHaveAttribute('data-portal-id', 'test')
      expect(link).toHaveTextContent('Collection Title')
    })

    test('onHandleRemove calls onDeleteRetrieval', async () => {
      const view = userEvent.setup()
      const onDeleteRetrieval = jest.fn()

      setup({
        earthdataEnvironment: 'prod',
        retrievalHistory: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{
            title: 'Collection Title'
          }]
        }],
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: true,
        onDeleteRetrieval
      })

      window.confirm = jest.fn().mockImplementation(() => true)

      const deleteButton = screen.getByRole('button', { name: /delete download/i })
      await view.click(deleteButton)

      expect(onDeleteRetrieval).toHaveBeenCalledTimes(1)
      expect(onDeleteRetrieval).toHaveBeenCalledWith('8069076')
    })
  })
})
