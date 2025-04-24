import React from 'react'
import {
  render,
  waitFor,
  act
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import nock from 'nock'

import { addToast } from '../../../util/addToast'
import { handleError } from '../../../actions/errors'
import DownloadHistoryContainer from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'

jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../actions/errors', () => ({
  handleError: jest.fn(() => ({ type: 'HANDLE_ERROR' }))
}))

let lastPassedOnDeleteRetrieval = null

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => ({
  DownloadHistory: jest.fn((props) => {
    lastPassedOnDeleteRetrieval = props.onDeleteRetrieval

    return <div>Download History Component</div>
  })
}))

const mockStore = configureStore([])

describe('DownloadHistoryContainer component', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      authToken: 'mock-token',
      earthdataEnvironment: 'prod'
    })

    jest.clearAllMocks()
    nock.cleanAll()
    lastPassedOnDeleteRetrieval = null
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('when the component renders', () => {
    test('renders the DownloadHistory component with the correct props', async () => {
      const historyData = [{
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      }]
      nock(/.*/)
        .get(/retrievals/)
        .reply(200, historyData)

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      await waitFor(() => {
        expect(DownloadHistory).toHaveBeenLastCalledWith(
          expect.objectContaining({
            earthdataEnvironment: 'prod',
            retrievalHistoryLoaded: true,
            retrievalHistoryLoading: false,
            retrievalHistory: historyData
          }),
          expect.anything()
        )
      })
    })
  })

  describe('when fetching retrieval history fails', () => {
    test('dispatches handleError', async () => {
      nock(/.*/)
        .get(/retrievals/)
        .replyWithError('Failed to fetch retrieval history')

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'fetchRetrievalHistory',
          resource: 'retrieval history',
          verb: 'fetching',
          notificationType: 'banner'
        })
      })

      await waitFor(() => {
        expect(DownloadHistory).toHaveBeenLastCalledWith(
          expect.objectContaining({
            retrievalHistoryLoaded: false,
            retrievalHistoryLoading: false,
            retrievalHistory: []
          }),
          expect.anything()
        )
      })
    })
  })

  describe('when deleting a retrieval', () => {
    const initialHistory = [{
      id: '8069076',
      jsondata: {},
      created_at: '2019-08-25T11:58:14.390Z',
      collections: [{}]
    }]

    beforeEach(() => {
      nock(/.*/)
        .get(/retrievals/)
        .reply(200, initialHistory)
    })

    test('handles successful deletion', async () => {
      nock(/.*/)
        .delete(/retrievals\/8069076/)
        .reply(200, {})

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      await waitFor(() => {
        expect(lastPassedOnDeleteRetrieval).toEqual(expect.any(Function))
      })

      await act(async () => {
        if (!lastPassedOnDeleteRetrieval) {
          throw new Error('onDeleteRetrieval callback was not captured by mock')
        }

        await lastPassedOnDeleteRetrieval('8069076')
      })

      await waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Retrieval removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })

      expect(handleError).not.toHaveBeenCalled()

      await waitFor(() => {
        expect(DownloadHistory).toHaveBeenLastCalledWith(
          expect.objectContaining({
            retrievalHistory: []
          }),
          expect.anything()
        )
      })
    })

    test('handles error when deletion fails', async () => {
      nock(/.*/)
        .delete(/retrievals\/8069076/)
        .replyWithError('Failed to delete retrieval')

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      await waitFor(() => {
        expect(lastPassedOnDeleteRetrieval).toEqual(expect.any(Function))
      })

      await act(async () => {
        if (!lastPassedOnDeleteRetrieval) {
          throw new Error('onDeleteRetrieval callback was not captured by mock')
        }

        await lastPassedOnDeleteRetrieval('8069076')
      })

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith({
          error: expect.any(Error),
          action: 'handleDeleteRetrieval',
          resource: 'retrieval',
          verb: 'deleting',
          notificationType: 'banner'
        })
      })

      expect(addToast).not.toHaveBeenCalledWith('Retrieval removed', expect.anything())

      await waitFor(() => {
        expect(DownloadHistory).toHaveBeenLastCalledWith(
          expect.objectContaining({
            retrievalHistory: initialHistory
          }),
          expect.anything()
        )
      })
    })
  })

  describe('mapStateToProps', () => {
    test('maps state to props correctly', () => {
      const mapStateToProps = (state) => ({
        authToken: state.authToken,
        earthdataEnvironment: state.earthdataEnvironment
      })

      const state = {
        authToken: 'testToken',
        earthdataEnvironment: 'prod'
      }

      expect(mapStateToProps(state)).toEqual({
        authToken: 'testToken',
        earthdataEnvironment: 'prod'
      })
    })
  })
})
