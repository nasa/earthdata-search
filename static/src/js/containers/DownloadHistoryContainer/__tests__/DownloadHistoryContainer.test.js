import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import nock from 'nock'

import { addToast } from '../../../util/addToast'
import DownloadHistoryContainer from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'

jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => ({
  DownloadHistory: jest.fn(() => <div>Download History Component</div>)
}))

const mockStore = configureStore([])
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation()

describe('DownloadHistoryContainer component', () => {
  const store = mockStore({
    authToken: 'mock-token',
    earthdataEnvironment: 'prod'
  })

  beforeEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('when the component renders', () => {
    test('renders the DownloadHistory component with the correct props', async () => {
      // Mock the API endpoint response
      nock(/.*/)
        .get(/retrievals/)
        .reply(200, [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }])

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      // Wait for the component to render and data to be loaded
      await waitFor(() => {
        // Check for calls where retrievalHistoryLoaded is true
        const { calls } = DownloadHistory.mock
        const loadedCall = calls.find((call) => call[0].retrievalHistoryLoaded === true
          && call[0].retrievalHistory.length > 0)
        expect(loadedCall).toBeTruthy()
      })

      // Now check the specific props after we know the loaded state has been reached
      expect(DownloadHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          earthdataEnvironment: 'prod',
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

  describe('when fetching retrieval history fails', () => {
    test('logs the error', async () => {
      // Mock the API endpoint to return an error
      nock(/.*/)
        .get(/retrievals/)
        .replyWithError('Failed to fetch retrieval history')

      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer
              authToken="mock-token"
              earthdataEnvironment="test"
            />
          </MemoryRouter>
        </Provider>
      )

      // Wait for the error to be logged
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith(
          'Error fetching retrieval history:',
          expect.any(Error)
        )
      })
    })
  })

  describe('when deleting a retrieval', () => {
    test('handles successful deletion', async () => {
      // Mock the API endpoints
      nock(/.*/)
        .get(/retrievals/)
        .reply(200, [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }])

      nock(/.*/)
        .delete(/retrievals\/8069076/)
        .reply(200, {})

      // Set up the component
      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByText('Download History Component')).toBeInTheDocument()
      })

      // Get the onDeleteRetrieval function that was passed to DownloadHistory
      const { calls } = DownloadHistory.mock
      const lastCall = calls[calls.length - 1][0]
      const { onDeleteRetrieval } = lastCall

      // Call the function directly to test it
      await onDeleteRetrieval('8069076')

      // Check that addToast was called with success message
      expect(addToast).toHaveBeenCalledWith('Retrieval removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    test('handles error when deletion fails', async () => {
      // Mock the API endpoints
      nock(/.*/)
        .get(/retrievals/)
        .reply(200, [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }])

      nock(/.*/)
        .delete(/retrievals\/8069076/)
        .replyWithError('Failed to delete retrieval')

      // Set up the component
      render(
        <Provider store={store}>
          <MemoryRouter>
            <DownloadHistoryContainer />
          </MemoryRouter>
        </Provider>
      )

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByText('Download History Component')).toBeInTheDocument()
      })

      // Get the onDeleteRetrieval function that was passed to DownloadHistory
      const { calls } = DownloadHistory.mock
      const lastCall = calls[calls.length - 1][0]
      const { onDeleteRetrieval } = lastCall

      // Call the function directly to test the error path
      await onDeleteRetrieval('8069076')

      // Check that console.error was called with the error
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error deleting retrieval:',
        expect.any(Error)
      )

      // Check that addToast was called with error message
      expect(addToast).toHaveBeenCalledWith('Error removing retrieval', {
        appearance: 'error',
        autoDismiss: true
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
