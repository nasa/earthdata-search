import ProjectRequest from '../projectRequest'
import Request from '../request'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('ProjectRequest#constructor', () => {
  test('sets the default values when authenticated', () => {
    const request = new ProjectRequest()

    expect(request.authenticated).toBeFalsy()
    expect(request.lambda).toBeTruthy()
  })
})

describe('ProjectRequest#permittedCmrKeys', () => {
  test('returns an array of timeline CMR keys', () => {
    const request = new ProjectRequest()

    expect(request.permittedCmrKeys()).toEqual([
      'auth_token',
      'name',
      'path',
      'project_id'
    ])
  })
})

describe('ProjectRequest#save', () => {
  test('calls Request#post', () => {
    const request = new ProjectRequest()

    const postMock = jest.spyOn(Request.prototype, 'post').mockImplementation()

    const params = { path: '/search', name: 'test project' }
    request.save(params)

    expect(postMock).toBeCalledTimes(1)
    expect(postMock).toBeCalledWith('save_project', params)
  })
})

describe('ProjectRequest#get', () => {
  test('calls Request#get', () => {
    const request = new ProjectRequest()

    const getMock = jest.spyOn(Request.prototype, 'get').mockImplementation()

    const projectId = '12345'
    request.get(projectId)

    expect(getMock).toBeCalledTimes(1)
    expect(getMock).toBeCalledWith('get_project?projectId=12345')
  })
})
