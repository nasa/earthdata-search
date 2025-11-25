import { downloadFile } from '../downloadFile'

describe('downloadFile', () => {
  test('downloads a file with the given content and filename', () => {
    const createObjectMock = jest.fn()
    window.URL.createObjectURL = createObjectMock

    const mockSetAttribute = jest.fn()
    const mockClick = jest.fn()
    const mockRemoveChild = jest.fn()
    jest.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: mockSetAttribute,
      click: mockClick,
      parentNode: {
        removeChild: mockRemoveChild
      }
    }))

    document.body.appendChild = jest.fn()

    const content = { mock: 'content' }

    downloadFile('test.txt', content)

    expect(createObjectMock).toHaveBeenCalledTimes(1)
    expect(createObjectMock).toHaveBeenCalledWith(new Blob([JSON.stringify(content)]))

    expect(mockSetAttribute).toHaveBeenCalledTimes(1)
    expect(mockSetAttribute).toHaveBeenCalledWith('download', 'test.txt')

    expect(mockClick).toHaveBeenCalledTimes(1)
    expect(mockClick).toHaveBeenCalledWith()

    expect(mockRemoveChild).toHaveBeenCalledTimes(1)
    expect(mockRemoveChild).toHaveBeenCalledWith({
      click: mockClick,
      href: undefined,
      parentNode: { removeChild: mockRemoveChild },
      setAttribute: mockSetAttribute
    })
  })
})
