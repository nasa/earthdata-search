import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { handleAlert } from '../alerts'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handleAlert', () => {
  test('calls lambda to log alert', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/localhost/)
      .post(/alert_logger/)
      .reply(200)

    // mockStore with initialState
    const store = mockStore({})

    await store.dispatch(handleAlert({
      action: 'mockAction',
      message: 'Mock messge',
      resource: 'mockResource',
      requestObject: {
        requestId: 'mockRequestId'
      }
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Action [mockAction] alert: Mock messge')
  })
})
