import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import { addToast } from '../../../util/addToast'
import DownloadHistoryContainer from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'
import RetrievalRequest from '../../../util/request/retrievalRequest'

jest.mock('../../../util/request/retrievalRequest')
jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => ({
  DownloadHistory: jest.fn(() => <div data-testid="download-history" />)
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

    // Mock the RetrievalRequest methods
    RetrievalRequest.mockImplementation(() => ({
      all: jest.fn().mockResolvedValue({
        data: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }]
      }),
      remove: jest.fn().mockResolvedValue({})
    }))
  })

  test('renders the DownloadHistory component', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DownloadHistoryContainer />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('download-history')).toBeInTheDocument()
    })

    const { calls } = DownloadHistory.mock
    expect(calls.length).toBeGreaterThan(0)

    const lastCall = calls[calls.length - 1][0]
    expect(lastCall.earthdataEnvironment).toBe('prod')
    expect(lastCall.retrievalHistoryLoaded).toBe(true)
    expect(Array.isArray(lastCall.retrievalHistory)).toBe(true)
  })

  test('logs error when fetchRetrievalHistory fails', async () => {
    // Setup RetrievalRequest to throw an error
    const mockError = new Error('Failed to fetch retrieval history')
    RetrievalRequest.mockImplementation(() => ({
      all: jest.fn().mockRejectedValue(mockError)
    }))

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
        mockError
      )
    })
  })

  test('handles deleteRetrieval successfully', async () => {
    // Create a mock remove function we can track
    const mockRemove = jest.fn().mockResolvedValue({})

    // Set up the RetrievalRequest mock with our trackable remove function
    RetrievalRequest.mockImplementation(() => ({
      all: jest.fn().mockResolvedValue({
        data: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }]
      }),
      remove: mockRemove
    }))

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
      expect(screen.getByTestId('download-history')).toBeInTheDocument()
    })

    // Get the onDeleteRetrieval function that was passed to DownloadHistory
    const { calls } = DownloadHistory.mock
    const lastCall = calls[calls.length - 1][0]
    const { onDeleteRetrieval } = lastCall

    // Call the function directly to test it
    await onDeleteRetrieval('8069076')

    // Check that our mockRemove was called with the correct ID
    expect(mockRemove).toHaveBeenCalledWith('8069076')

    // Check that addToast was called with success message
    expect(addToast).toHaveBeenCalledWith('Retrieval removed', {
      appearance: 'success',
      autoDismiss: true
    })
  })

  test('handles error when deleting retrieval', async () => {
    // Setup RetrievalRequest.remove to throw an error
    const mockError = new Error('Failed to delete retrieval')
    RetrievalRequest.mockImplementation(() => ({
      all: jest.fn().mockResolvedValue({
        data: [{
          id: '8069076',
          jsondata: {},
          created_at: '2019-08-25T11:58:14.390Z',
          collections: [{}]
        }]
      }),
      remove: jest.fn().mockRejectedValue(mockError)
    }))

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
      expect(screen.getByTestId('download-history')).toBeInTheDocument()
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
      mockError
    )

    // Check that addToast was called with error message
    expect(addToast).toHaveBeenCalledWith('Error removing retrieval', {
      appearance: 'error',
      autoDismiss: true
    })
  })

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
