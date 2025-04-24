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

const setup = (props) => render(
  <MemoryRouter>
    <DownloadHistory {...props} />
  </MemoryRouter>
)

beforeEach(() => {
  jest.clearAllMocks()
  deployedEnvironment.deployedEnvironment.mockImplementation(() => 'prod')
  AppConfig.getEnvironmentConfig.mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

describe('DownloadHistory component', () => {
  describe('when passed the correct props', () => {
    describe('when retrievals are loading', () => {
      test('renders a spinner', () => {
        setup({
          earthdataEnvironment: 'prod',
          retrievalHistory: [],
          retrievalHistoryLoading: true,
          retrievalHistoryLoaded: false,
          onDeleteRetrieval: jest.fn()
        })

        expect(screen.getByRole('heading', { name: /download status & history/i })).toBeInTheDocument()
        expect(screen.getByTestId('spinner')).toBeInTheDocument()
        expect(screen.getByTestId('spinner')).toHaveClass('download-history__spinner')
      })
    })

    describe('when no retrievals exist', () => {
      test('renders a message', () => {
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
    })

    describe('when a retrieval exists with one collection that has no title', () => {
      test('renders a table with collection count', () => {
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
        expect(screen.getByRole('link', { name: '1 collection' })).toHaveAttribute('href', '/downloads/8069076')
      })
    })

    describe('when a retrieval exists with one collection', () => {
      test('renders a table with the collection title', () => {
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
        expect(screen.getByRole('link', { name: 'Collection Title' })).toHaveAttribute('href', '/downloads/8069076')
      })
    })

    describe('when a retrieval exists with two collections', () => {
      test('renders a table with the first collection title and count of others', () => {
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
        expect(screen.getByRole('link', { name: 'Collection Title and 1 other collection' })).toHaveAttribute('href', '/downloads/8069076')
      })
    })

    describe('when portals were used to place an order', () => {
      test('renders links with the correct portal ID', () => {
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
        const link = screen.getByRole('link', { name: 'Collection Title' })
        expect(link).toHaveAttribute('href', '/downloads/8069076')
        expect(link).toHaveAttribute('data-portal-id', 'test')
      })
    })

    describe('when the earthdataEnvironment doesn\'t match the deployed environment', () => {
      test('renders links with the correct environment parameter', () => {
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
        const link = screen.getByRole('link', { name: 'Collection Title' })
        expect(link).toHaveAttribute('href', '/downloads/8069076?ee=uat')
        expect(link).toHaveAttribute('data-portal-id', 'test')
      })
    })

    describe('when the delete button is clicked', () => {
      test('calls onDeleteRetrieval with the correct ID', async () => {
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
})
