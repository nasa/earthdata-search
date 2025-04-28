import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'
import { mapStateToProps, mapDispatchToProps } from '../DownloadHistoryContainer'
import * as errorsModule from '../../../actions/errors'

jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
  env: 'test',
  defaultCmrPageSize: 20
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
      test('calls onDeleteRetrieval with the correct ID when confirmed', async () => {
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

      test('does not call onDeleteRetrieval when not confirmed', async () => {
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

        window.confirm = jest.fn().mockImplementation(() => false)

        const deleteButton = screen.getByRole('button', { name: /delete download/i })
        await view.click(deleteButton)

        expect(onDeleteRetrieval).not.toHaveBeenCalled()
      })
    })

    describe('when multiple retrievals exist', () => {
      test('renders a table with multiple rows', () => {
        setup({
          earthdataEnvironment: 'prod',
          retrievalHistory: [
            {
              id: '8069076',
              jsondata: {},
              created_at: '2019-08-25T11:58:14.390Z',
              collections: [{
                title: 'Collection A'
              }]
            },
            {
              id: '8069077',
              jsondata: {},
              created_at: '2019-08-26T12:00:00.000Z',
              collections: [{
                title: 'Collection B'
              }]
            }
          ],
          retrievalHistoryLoading: false,
          retrievalHistoryLoaded: true,
          onDeleteRetrieval: jest.fn()
        })

        const rows = screen.getAllByRole('row')
        expect(rows).toHaveLength(3)
        expect(screen.getByRole('link', { name: 'Collection A' })).toHaveAttribute('href', '/downloads/8069076')
        expect(screen.getByRole('link', { name: 'Collection B' })).toHaveAttribute('href', '/downloads/8069077')
      })
    })

    describe('when a retrieval exists', () => {
      test('renders the created_at date', () => {
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
        const timeElement = screen.getByText(/years ago/i).closest('time')
        expect(timeElement).toHaveAttribute('datetime', '2019-08-25T11:58:14.390Z')
      })
    })

    describe('when a retrieval exists with no collections', () => {
      test('renders a table with "0 collections"', () => {
        setup({
          earthdataEnvironment: 'prod',
          retrievalHistory: [{
            id: '8069076',
            jsondata: {},
            created_at: '2019-08-25T11:58:14.390Z',
            collections: []
          }],
          retrievalHistoryLoading: false,
          retrievalHistoryLoaded: true,
          onDeleteRetrieval: jest.fn()
        })

        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: '0 collections' })).toHaveAttribute('href', '/downloads/8069076')
      })
    })
  })
})

describe('mapStateToProps', () => {
  test('maps state to props correctly', () => {
    const state = {
      authToken: 'mockToken',
      earthdataEnvironment: 'prod'
    }
    const props = mapStateToProps(state)
    expect(props).toEqual({
      authToken: 'mockToken',
      earthdataEnvironment: 'prod'
    })
  })
})

describe('mapDispatchToProps', () => {
  beforeEach(() => {
    jest.spyOn(errorsModule, 'handleError').mockImplementation(
      (errorConfig) => ({
        type: 'HANDLE_ERROR',
        payload: errorConfig
      })
    )
  })

  test('maps dispatch to props correctly', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    const errorConfig = { some: 'error' }

    props.dispatchHandleError(errorConfig)

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'HANDLE_ERROR',
      payload: errorConfig
    })
  })
})
