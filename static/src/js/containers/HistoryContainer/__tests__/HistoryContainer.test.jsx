import setupTest from '../../../../../../jestConfigs/setupTest'
import routerHelper from '../../../router/router'
import HistoryContainer from '../HistoryContainer'

const setup = setupTest({
  Component: HistoryContainer
})

describe('HistoryContainer', () => {
  test('sets up and tears down the router subscription', () => {
    const subscribeMock = jest.fn()
    const unsubscribeMock = jest.fn()

    routerHelper.router.subscribe = subscribeMock.mockReturnValue(unsubscribeMock)

    const { unmount } = setup()

    expect(routerHelper.router.subscribe).toHaveBeenCalledTimes(1)
    expect(routerHelper.router.subscribe).toHaveBeenCalledWith(expect.any(Function))

    unmount()

    expect(unsubscribeMock).toHaveBeenCalledTimes(1)
    expect(unsubscribeMock).toHaveBeenCalledWith()
  })
})
