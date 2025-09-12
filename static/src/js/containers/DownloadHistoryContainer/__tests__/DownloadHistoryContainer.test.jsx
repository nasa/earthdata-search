import React from 'react'
import {
  screen,
  waitFor,
  act
} from '@testing-library/react'
import nock from 'nock'

import setupTest from '../../../../../../jestConfigs/setupTest'

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

const setup = setupTest({
  Component: DownloadHistoryContainer,
  defaultProps: {
    authToken: 'testToken',
    dispatchHandleError: jest.fn()
  }
})

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
      authToken: 'testTokenFromState'
    }

    const expectedProps = {
      authToken: 'testTokenFromState'
    }

    expect(mapStateToProps(mockState)).toEqual(expectedProps)
  })
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
      expect(DownloadHistory).toHaveBeenCalledTimes(4)
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
      retrievalHistoryLoaded: false,
      retrievalHistoryLoading: true,
      retrievalHistory: [{
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      }]
    }, {})

    expect(DownloadHistory).toHaveBeenNthCalledWith(4, {
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

  test('handles the case when authToken is not provided', async () => {
    setup({
      overrideProps: {
        authToken: ''
      }
    })

    expect(screen.getByRole('heading', { name: 'Download Status & History' })).toBeInTheDocument()

    expect(DownloadHistory).toHaveBeenCalledWith(
      expect.objectContaining({
        retrievalHistoryLoading: false,
        retrievalHistoryLoaded: false,
        retrievalHistory: []
      }),
      {}
    )

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

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))
    })

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

    const { props, user } = setup()

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '8069076' })).toBeInTheDocument()
    })

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Delete Download 8069076' }))
    })

    await waitFor(() => {
      expect(props.dispatchHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          action: 'handleDeleteRetrieval'
        })
      )
    })

    expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
  })
})
