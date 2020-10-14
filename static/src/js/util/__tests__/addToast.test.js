import addToast from '../addToast'

describe('addToast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call the add method provided by the ToastProvider', () => {
    const content = 'addToats test message'
    const providerAddMock = window.reactToastProvider.current.add
    const options = {
      appearance: 'info',
      autoDismiss: true,
      placement: 'top-right'
    }
    addToast(content, options)
    expect(providerAddMock).toHaveBeenCalledTimes(1)
    expect(providerAddMock).toHaveBeenCalledWith(content, {
      appearance: 'info',
      autoDismiss: true,
      placement: 'top-right'
    })
  })

  test('should fail and report error to console', () => {
    const content = 'addToats test message'
    window.reactToastProvider.current.add = undefined
    const options = {
      appearance: 'error',
      autoDismiss: false,
      placement: 'top-right'
    }
    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    addToast(content, options)
    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Add toast method not available.')
  })
})
