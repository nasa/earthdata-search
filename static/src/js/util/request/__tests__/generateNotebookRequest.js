import GenerateNotebookRequest from '../generateNotebookRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('GenerateNotebookRequest#constructor', () => {
  test('sets the default values correctly', () => {
    const request = new GenerateNotebookRequest()

    expect(request.baseUrl).toEqual('http://localhost:3000')
  })
})

describe('GenerateNotebookRequest#generateNotebook', () => {
  test('calls Request#post', () => {
    const token = '123'
    const request = new GenerateNotebookRequest(token)

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    request.generateNotebook({ granuleId: 'G123456789-TESTPROV' })

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('generate_notebook', { granuleId: 'G123456789-TESTPROV' })
  })
})
