import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { UPDATE_SAVED_PROJECT, REMOVE_SAVED_PROJECT } from '../../constants/actionTypes'
import {
  updateSavedProject,
  updateProjectName,
  deleteSavedProject
} from '../savedProject'

import * as addToast from '../../util/addToast'

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

    const store = mockStore({
      router: {
        location: {
          pathname: '/projectId=1',
          search: ''
        }
      },
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

    const store = mockStore({
      router: {
        location: {
          pathname: '/search',
          search: '?p=C00001-EDSC'
        }
      },
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

    const store = mockStore({
      router: {
        location: {
          pathname: '/projectId=1',
          search: ''
        }
      },
      savedProject: {
        projectId: 1,
        path: '/search?p=C00001-EDSC'
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(updateProjectName(name)).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('deleteSavedProject', () => {
  test('calls lambda to delete a project', async () => {
    const addToastMock = jest.spyOn(addToast, 'addToast')

    nock(/localhost/)
      .delete(/2057964173/)
      .reply(204)

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(deleteSavedProject('2057964173')).then(() => {
      expect(store.getActions().length).toEqual(1)
      expect(store.getActions()[0]).toEqual({
        payload: '2057964173',
        type: REMOVE_SAVED_PROJECT
      })

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Project removed')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
    })
  })

  test('does not call removeSavedProject on error', async () => {
    nock(/localhost/)
      .delete(/2057964173/)
      .reply(500, {
        errors: ['An error occured.']
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'mockToken',
      retrievalHistory: []
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(deleteSavedProject('2057964173')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
