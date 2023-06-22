import { getOperatingSystem } from '../parseUserAgent'

describe('Test operating system parsing of user-agent', () => {
  test('render the download link for Windows', () => {
    const windowsUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
    const os = getOperatingSystem(windowsUserAgent)
    expect(os).toEqual('Windows')
  })

  test('render the download link for MacOS', () => {
    const macOsUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
    const os = getOperatingSystem(macOsUserAgent)
    expect(os).toEqual('macOS')
  })

  test('render the download link for Linux', () => {
    const linuxUserAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1'
    const os = getOperatingSystem(linuxUserAgent)
    expect(os).toEqual('Linux')
  })

  test('Return null if the user-agent could not be parsed', () => {
    const fakeUserAgent = 'mock-testing'
    const os = getOperatingSystem(fakeUserAgent)
    expect(os).toEqual(null)
  })
})
