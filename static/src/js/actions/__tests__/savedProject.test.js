import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { UPDATE_SAVED_PROJECT } from '../../constants/actionTypes'
import { updateSavedProject, updateProjectName } from '../savedProject'
import useEdscStore from '../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateSavedProject', () => {
  test('should create an action to update the savedProject', () => {
    const payload = {
      path: '/search',
      projectId: 1
    }

    const expectedAction = {
      type: UPDATE_SAVED_PROJECT,
      payload
    }

    expect(updateSavedProject(payload)).toEqual(expectedAction)
  })
})

describe('updateProjectName', () => {
  test('updates the project name then calls updateSavedProject', async () => {
    const name = 'test name'

    nock(/localhost/)
      .post('/projects')
      .reply(200, {
        name,
        project_id: 1,
        path: '/search?p=C00001-EDSC'
      })

    const mockNavigate = jest.fn()
    useEdscStore.setState({
      location: {
        location: {
          pathname: '/search',
          search: 'projectId=1'
        },
        navigate: mockNavigate
      }
    })

    const store = mockStore({
      savedProject: {
        projectId: 1,
        path: '/search?p=C00001-EDSC'
      }
    })

    await store.dispatch(updateProjectName(name)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          name,
          projectId: 1,
          path: '/search?p=C00001-EDSC'
        },
        type: UPDATE_SAVED_PROJECT
      })

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/search?projectId=1', { replace: true })
    })
  })

  test('when the project doesn\'t have a path yet, saves the path from the URL', async () => {
    const name = 'test name'

    nock(/localhost/)
      .post('/projects')
      .reply(200, {
        name,
        project_id: 1,
        path: '/search?p=C00001-EDSC'
      })

    const mockNavigate = jest.fn()
    useEdscStore.setState({
      location: {
        location: {
          pathname: '/search',
          search: '?p=C00001-EDSC'
        },
        navigate: mockNavigate
      }
    })

    const store = mockStore({
      savedProject: {}
    })

    await store.dispatch(updateProjectName(name)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          name,
          projectId: 1,
          path: '/search?p=C00001-EDSC'
        },
        type: UPDATE_SAVED_PROJECT
      })

      expect(mockNavigate).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/search?projectId=1', { replace: true })
    })
  })

  test('does not call updateSavedProject on error', async () => {
    const name = 'test name'

    nock(/localhost/)
      .post(/projects/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const mockNavigate = jest.fn()
    useEdscStore.setState({
      location: {
        location: {
          pathname: '/projectId=1',
          search: ''
        },
        navigate: mockNavigate
      }
    })

    const store = mockStore({
      savedProject: {
        projectId: 1,
        path: '/search?p=C00001-EDSC'
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(updateProjectName(name)).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)

      expect(mockNavigate).toHaveBeenCalledTimes(0)
    })
  })
})
