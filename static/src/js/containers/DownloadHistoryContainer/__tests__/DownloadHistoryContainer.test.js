import React from 'react'
import {
  render,
  screen,
  waitFor,
  act
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import nock from 'nock'

import { addToast } from '../../../util/addToast'
import actions from '../../../actions'
import {
  DownloadHistoryContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../DownloadHistoryContainer'
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
  addToast: jest.fn()
}))

jest.mock('../../../actions', () => ({
  handleError: jest.fn((errorConfig) => ({
    type: 'HANDLE_ERROR',
    errorConfig
  }))
}))

const setup = (props) => {
  const defaultProps = {
    authToken: 'testToken',
    earthdataEnvironment: 'prod',
    dispatchHandleError: jest.fn()
  }

  return render(
    <DownloadHistoryContainer
      {...defaultProps}
      {...props}
    />
  )
}

describe('mapDispatchToProps', () => {
  test('dispatchHandleError calls actions.handleError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'handleError')

    mapDispatchToProps(dispatch).dispatchHandleError({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('mapStateToProps', () => {
  test('should return the authToken and earthdataEnvironment from the state', () => {
    const mockState = {
      authToken: 'testTokenFromState',
      earthdataEnvironment: 'prodFromState'
    }

    const expectedProps = {
      authToken: 'testTokenFromState',
      earthdataEnvironment: 'prodFromState'
    }

    expect(mapStateToProps(mockState)).toEqual(expectedProps)
  })
})

describe('DownloadHistoryContainer component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    nock(/localhost/)
      .get(/retrievals/)
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
      expect(DownloadHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          earthdataEnvironment: 'prod',
          retrievalHistoryLoading: false,
          retrievalHistoryLoaded: true,
          retrievalHistory: expect.arrayContaining([
            expect.objectContaining({
              id: '8069076'
            })
          ])
        }),
        expect.anything()
      )
    })
  })

  test('handles the case when authToken is not provided', async () => {
    setup({ authToken: '' })

    expect(screen.getByRole('heading', { name: 'Download Status & History' })).toBeInTheDocument()

    expect(DownloadHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: false,
        retrievalHistory: []
      }),
      expect.anything()
    )
  })

  test('successfully deletes a retrieval when confirmed', async () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    nock(/localhost/)
      .delete(/retrievals\/8069076/)
      .reply(204)

    const view = userEvent.setup()
    setup()

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '8069076' })).toBeInTheDocument()
    })

    await act(async () => {
      await view.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))
    })

    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith('Retrieval removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })
  })

  test('handles errors when deleting a retrieval', async () => {
    window.confirm = jest.fn().mockImplementation(() => true)

    nock(/localhost/)
      .delete(/retrievals\/8069076/)
      .replyWithError('Connection error')

    const dispatchHandleError = jest.fn()
    const view = userEvent.setup()

    setup({ dispatchHandleError })

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '8069076' })).toBeInTheDocument()
    })

    await act(async () => {
      await view.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))
    })

    await waitFor(() => {
      expect(dispatchHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          action: 'handleDeleteRetrieval'
        })
      )
    })
  })
})
