import nock from 'nock'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'

import DownloadHistoryContainer, {
  mapStateToProps,
  mapDispatchToProps
} from '../DownloadHistoryContainer'

jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../actions', () => ({
  handleError: jest.fn((errorConfig) => ({
    type: 'HANDLE_ERROR',
    errorConfig
  }))
}))

const mockStore = configureStore([])

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
    nock(/localhost/)
      .get(/retrievals/)
      .reply(200, {
        id: '8069076',
        jsondata: {},
        created_at: '2019-08-25T11:58:14.390Z',
        collections: [{}]
      })

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

    expect(await screen.findByRole('heading', { name: 'Download Status & History' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { href: '/downloads/8069076' })).toBeInTheDocument()
    expect(await screen.findByText('6 years ago')).toBeInTheDocument()
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
