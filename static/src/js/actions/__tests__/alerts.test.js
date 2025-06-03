import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { handleAlert } from '../alerts'
import useEdscStore from '../../zustand/useEdscStore'
import LoggerRequest from '../../util/request/loggerRequest'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handleAlert', () => {
  test('calls lambda to log alert', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    const loggerSpy = jest.spyOn(LoggerRequest.prototype, 'alert')

    nock(/localhost/)
      .post(/alert_logger/)
      .reply(200)

    // MockStore with initialState
    const store = mockStore({})

    useEdscStore.setState({
      location: {
        location: {
          pathname: '/search',
          search: '?query=mock'
        }
      }
    })

    await store.dispatch(handleAlert({
      action: 'mockAction',
      message: 'Mock message',
      resource: 'mockResource',
      requestObject: {
        requestId: 'mockRequestId'
      }
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Action [mockAction] alert: Mock message')

    expect(loggerSpy).toHaveBeenCalledTimes(1)
    expect(loggerSpy).toHaveBeenCalledWith({
      alert: {
        action: 'mockAction',
        guid: 'mockRequestId',
        location: {
          pathname: '/search',
          search: '?query=mock'
        },
        message: 'Mock message',
        resource: 'mockResource'
      }
    })
  })
})
