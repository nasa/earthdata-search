import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import nock from 'nock'

import setupTest from '../../../../../../jestConfigs/setupTest'

import addToast from '../../../util/addToast'
import DownloadHistoryContainer from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => ({
  DownloadHistory: jest.fn((props) => (
    <div>
      <h2>Download Status & History</h2>
      {
        props.retrievalHistoryLoaded && props.retrievalHistory.map((item) => (
          <div key={item.id}>
            <a href={`/downloads/${item.id}`}>{item.id}</a>
            <button
              type="button"
              onClick={() => props.onDeleteRetrieval(item.id)}
              aria-label={`Delete Download ${item.id}`}
            >
              Delete Download
            </button>
          </div>
        ))
      }
    </div>
  ))
}))

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const setup = setupTest({
  Component: DownloadHistoryContainer,
  defaultZustandState: {
    user: {
      edlToken: 'testToken'
    }
  }
})

describe('DownloadHistoryContainer component', () => {
  beforeEach(() => {
    nock(/localhost/)
      .get(/retrievals/)
      .once()
      .reply(200, [{
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      }])
  })

  test('renders the DownloadHistory component and passes correct props', async () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Download Status & History' })).toBeInTheDocument()

    await waitFor(() => {
      expect(DownloadHistory).toHaveBeenCalledTimes(3)
    })

    expect(DownloadHistory).toHaveBeenNthCalledWith(1, {
      earthdataEnvironment: 'prod',
      onDeleteRetrieval: expect.any(Function),
      retrievalHistoryLoaded: false,
      retrievalHistoryLoading: false,
      retrievalHistory: []
    }, {})

    expect(DownloadHistory).toHaveBeenNthCalledWith(2, {
      earthdataEnvironment: 'prod',
      onDeleteRetrieval: expect.any(Function),
      retrievalHistoryLoaded: false,
      retrievalHistoryLoading: true,
      retrievalHistory: []
    }, {})

    expect(DownloadHistory).toHaveBeenNthCalledWith(3, {
      earthdataEnvironment: 'prod',
      onDeleteRetrieval: expect.any(Function),
      retrievalHistoryLoaded: true,
      retrievalHistoryLoading: false,
      retrievalHistory: [{
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      }]
    }, {})
  })

  test('handles the case when edlToken is not provided', async () => {
    setup({
      overrideZustandState: {
        user: {
          edlToken: null
        }
      }
    })

    expect(screen.getByRole('heading', { name: 'Download Status & History' })).toBeInTheDocument()

    expect(DownloadHistory).toHaveBeenCalledWith({
      earthdataEnvironment: 'prod',
      onDeleteRetrieval: expect.any(Function),
      retrievalHistoryLoading: false,
      retrievalHistoryLoaded: false,
      retrievalHistory: []
    }, {})

    expect(DownloadHistory).toHaveBeenCalledTimes(1)
  })

  test('successfully deletes a retrieval when confirmed', async () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    nock(/localhost/)
      .delete(/retrievals\/8069076/)
      .reply(204)

    const { user } = setup()

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '8069076' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith('Retrieval removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    expect(addToast).toHaveBeenCalledTimes(1)
  })

  test('handles errors when deleting a retrieval', async () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    nock(/localhost/)
      .delete(/retrievals\/8069076/)
      .replyWithError('Connection error')

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const { user, zustandState } = setup({
      overrideZustandState: {
        errors: {
          handleError: jest.fn()
        }
      }
    })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '8069076' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))

    await waitFor(() => {
      expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
    })

    expect(zustandState.errors.handleError).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        action: 'handleDeleteRetrieval',
        resource: 'retrieval',
        verb: 'deleting',
        notificationType: 'banner'
      })
    )
  })
})
