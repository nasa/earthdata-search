import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { UPDATE_SAVED_PROJECT, REMOVE_SAVED_PROJECT, CLEAR_SAVED_PROJECT } from '../../constants/actionTypes'
import {
  clearSavedProject,
  updateSavedProject,
  updateProjectName,
  deleteSavedProject
} from '../savedProject'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('clearSavedProject', () => {
  test('should create an action to update the savedProject', () => {
    const expectedAction = {
      type: CLEAR_SAVED_PROJECT
    }

    expect(clearSavedProject()).toEqual(expectedAction)
  })
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
})

describe('deleteSavedProject', () => {
  test('calls lambda to delete a project', async () => {
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
    })
  })
})
