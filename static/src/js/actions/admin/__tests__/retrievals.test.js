import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import * as addToast from '../../../util/addToast'
import actions from '../../index'
import { requeueOrder } from '../retrievals'

const mockStore = configureMockStore([thunk])

describe('requeueOrder', () => {
  test('sends request to requeue order', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const orderId = 1234

    nock(/localhost/)
      .post(/requeue/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(requeueOrder(orderId))

    expect(addToastMock).toHaveBeenCalledTimes(1)
    expect(addToastMock).toHaveBeenCalledWith(
      'Order Requeued for processing',
      {
        appearance: 'success',
        autoDismiss: true
      }
    )
  })

  test('calls handleError when there is an error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')
    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    const orderId = 1234

    nock(/localhost/)
      .post(/requeue/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(requeueOrder(orderId))

    expect(handleErrorMock).toHaveBeenCalledTimes(1)
    expect(handleErrorMock).toHaveBeenCalledWith(expect.objectContaining({
      action: 'requeueOrder',
      notificationType: 'toast',
      resource: 'admin retrievals'
    }))

    expect(consoleMock).toHaveBeenCalledTimes(1)
  })
})
