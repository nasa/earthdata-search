import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { handleAlert } from '../alerts'

const mockStore = configureMockStore([thunk])

describe('handleAlert', () => {
  test('calls lambda to log alert', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/localhost/)
      .post(/alert_logger/, (body) => {
        const { alert } = body.params

        return alert.action === 'mockAction'
          && alert.guid === 'mockRequestId'
          && alert.message === 'Mock message'
          && alert.resource === 'mockResource'
      })
      .reply(200)

    // MockStore with initialState
    const store = mockStore({})

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
  })
})
