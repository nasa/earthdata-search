import nock from 'nock'
import { handleAlert } from '../handleAlert'

describe('handleAlert', () => {
  test('calls lambda to log alert', async () => {
    const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

    nock(/localhost/)
      .post(/alert_logger/, (body) => {
        const { alert } = body.params

        return alert.action === 'mockAction'
          && alert.guid === 'mockRequestId'
          && alert.message === 'Mock message'
          && alert.resource === 'mockResource'
      })
      .reply(200)

    handleAlert({
      action: 'mockAction',
      message: 'Mock message',
      resource: 'mockResource',
      requestObject: {
        requestId: 'mockRequestId'
      }
    })

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Action [mockAction] alert: Mock message')
  })
})
