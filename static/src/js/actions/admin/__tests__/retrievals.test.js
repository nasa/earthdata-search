import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { requeueOrder } from '../retrievals'

import addToast from '../../../util/addToast'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const mockStore = configureMockStore([thunk])

describe('requeueOrder', () => {
  test('sends request to requeue order', async () => {
    const orderId = 1234

    nock(/localhost/)
      .post(/requeue/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(requeueOrder(orderId))

    expect(addToast).toHaveBeenCalledTimes(1)
    expect(addToast).toHaveBeenCalledWith(
      'Order Requeued for processing',
      {
        appearance: 'success',
        autoDismiss: true
      }
    )
  })

  test('calls handleError when there is an error', async () => {
    useEdscStore.setState({
      errors: {
        ...useEdscStore.getState().errors,
        handleError: jest.fn()
      }
    })

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

    const { errors } = useEdscStore.getState()
    expect(errors.handleError).toHaveBeenCalledTimes(1)
    expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
      action: 'requeueOrder',
      notificationType: 'toast',
      resource: 'admin retrievals'
    }))
  })
})
