import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

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

describe('DownloadHistoryContainer component', () => {
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
    const store = mockStore({
      authToken: 'testToken',
      earthdataEnvironment: 'prod'
    })
    
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
    
    const calls = DownloadHistory.mock.calls
    expect(calls.length).toBeGreaterThan(0)
    
    const lastCall = calls[calls.length - 1][0]
    expect(lastCall.earthdataEnvironment).toBe('prod')
    expect(lastCall.retrievalHistoryLoaded).toBe(true)
    expect(Array.isArray(lastCall.retrievalHistory)).toBe(true)
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