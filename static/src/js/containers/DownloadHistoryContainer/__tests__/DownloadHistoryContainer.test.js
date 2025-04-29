import React from 'react'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import DownloadHistoryContainer, {
  mapStateToProps,
  mapDispatchToProps
} from '../DownloadHistoryContainer'
import { DownloadHistory } from '../../../components/DownloadHistory/DownloadHistory'
import RetrievalRequest from '../../../util/request/retrievalRequest'

jest.mock('../../../util/request/retrievalRequest')
jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../actions', () => ({
  handleError: jest.fn((errorConfig) => ({
    type: 'HANDLE_ERROR',
    errorConfig
  }))
}))

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => ({
  DownloadHistory: jest.fn(() => <div data-testid="download-history" />)
}))

const mockStore = configureStore([])

describe('DownloadHistoryContainer component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

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

  test('renders the DownloadHistory component and passes correct props', async () => {
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

    const expectedProps = {
      earthdataEnvironment: 'prod',
      retrievalHistoryLoaded: true,
      retrievalHistory: [{
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      }],
      onDeleteRetrieval: expect.any(Function)
    }

    const matchingCall = DownloadHistory.mock.calls.find((call) => {
      const props = call[0]

      return expect.objectContaining(expectedProps).asymmetricMatch(props)
    })

    expect(matchingCall).toBeTruthy()
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

  describe('mapDispatchToProps', () => {
    test('should dispatch the handleError action with the correct error configuration', () => {
      const dispatch = jest.fn()
      const mockError = new Error('Test Error')
      const expectedErrorConfig = {
        error: mockError,
        action: 'testAction',
        resource: 'testResource',
        verb: 'testing',
        notificationType: 'banner'
      }
      const { dispatchHandleError } = mapDispatchToProps(dispatch)

      dispatchHandleError(expectedErrorConfig)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'HANDLE_ERROR',
          errorConfig: expectedErrorConfig
        })
      )
    })
  })
})
