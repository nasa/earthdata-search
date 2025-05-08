import React from 'react'
import {
  render,
  act,
  waitFor
} from '@testing-library/react'
import nock from 'nock'

import actions from '../../../actions'
import { getEarthdataEnvironment } from '../../../selectors/earthdataEnvironment'
import { addToast } from '../../../util/addToast'
import { SavedProjects } from '../../../components/SavedProjects/SavedProjects'
import {
  mapStateToProps,
  mapDispatchToProps,
  SavedProjectsContainer
} from '../SavedProjectsContainer'

jest.mock('../../../components/SavedProjects/SavedProjects', () => ({
  SavedProjects: jest.fn(() => (
    <div aria-label="Saved Projects">Saved Projects</div>
  ))
}))

jest.mock('../../../util/addToast', () => ({
  addToast: jest.fn()
}))

jest.mock('../../../selectors/earthdataEnvironment', () => ({
  getEarthdataEnvironment: jest.fn()
}))

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('path')
  })

  test('dispatchHandleError calls actions.handleError', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'handleError')
    const errorConfig = { error: 'test-error' }

    mapDispatchToProps(dispatch).dispatchHandleError(errorConfig)

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(errorConfig)
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    getEarthdataEnvironment.mockReturnValue('prod-env')
    const store = {
      authToken: 'mock-token'
    }

    expect(mapStateToProps(store)).toEqual({
      authToken: 'mock-token',
      earthdataEnvironment: 'prod-env'
    })
  })
})

describe('SavedProjectsContainer', () => {
  const setup = (propsOverride = {}) => {
    const mockOnChangePath = jest.fn()
    const mockDispatchHandleError = jest.fn()

    const defaultProps = {
      authToken: 'TEST_TOKEN_DEFAULT',
      earthdataEnvironment: 'uat',
      onChangePath: mockOnChangePath,
      dispatchHandleError: mockDispatchHandleError
    }

    const finalProps = {
      ...defaultProps,
      ...propsOverride
    }

    render(<SavedProjectsContainer {...finalProps} />)

    return {
      mockOnChangePath,
      mockDispatchHandleError,
      props: finalProps
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    SavedProjects.mockClear()
    nock.cleanAll()
    nock.disableNetConnect()
  })

  describe('When the component mounts successfully with a valid authToken', () => {
    test('fetches projects and renders SavedProjects with project data', async () => {
      const mockProjects = [
        {
          id: '123',
          name: 'Project 1',
          path: '/search?p=!C123',
          created_at: '2022-01-01T00:00:00.000Z'
        }
      ]

      nock(/localhost/)
        .get(/projects/)
        .reply(200, mockProjects)

      setup()

      await waitFor(() => {
        const callWithLoadedData = SavedProjects.mock.calls.find(
          (call) => call[0].isLoaded === true
                     && call[0].isLoading === false
                     && call[0].projects.length > 0
        )
        expect(callWithLoadedData).toBeTruthy()

        if (callWithLoadedData) {
          const [propsInCall] = callWithLoadedData
          expect(propsInCall.isLoaded).toBe(true)
          expect(propsInCall.isLoading).toBe(false)
          expect(propsInCall.projects).toEqual(mockProjects)
          expect(typeof propsInCall.onDeleteProject).toBe('function')
        }
      })
    })
  })

  describe('When the authToken is null', () => {
    test('renders SavedProjects with no projects and appropriate loading states', async () => {
      setup({ authToken: null })

      await waitFor(() => {
        expect(SavedProjects).toHaveBeenCalled()
        const lastCall = SavedProjects.mock.calls[SavedProjects.mock.calls.length - 1]
        expect(lastCall[0].isLoading).toBe(false)
        expect(lastCall[0].isLoaded).toBe(false)
        expect(lastCall[0].projects).toEqual([])
      })
    })
  })

  describe('When deleting a project', () => {
    const projectIdToDelete = '123'
    const mockProjects = [
      {
        id: projectIdToDelete,
        name: 'Project 1',
        path: '/search?p=!C123',
        created_at: '2022-01-01T00:00:00.000Z'
      }
    ]

    beforeEach(() => {
      nock(/localhost/)
        .get(/projects/)
        .reply(200, mockProjects)

      window.confirm = jest.fn(() => true)
    })

    test('successfully deletes the project and shows a success toast', async () => {
      nock(/localhost/)
        .delete(`/projects/${projectIdToDelete}`)
        .reply(204)

      setup()

      let onDeleteProjectCallback
      await waitFor(() => {
        const callWithLoadedData = SavedProjects.mock.calls.find(
          (call) => call[0].isLoaded === true && call[0].projects.length > 0
        )
        expect(callWithLoadedData).toBeTruthy()
        onDeleteProjectCallback = callWithLoadedData[0].onDeleteProject
        expect(typeof onDeleteProjectCallback).toBe('function')
      })

      await act(async () => {
        await onDeleteProjectCallback(projectIdToDelete)
      })

      await waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })

      expect(nock.isDone()).toBe(true)
    })

    test('handles error during project deletion and shows an error toast', async () => {
      nock(/localhost/)
        .delete(`/projects/${projectIdToDelete}`)
        .replyWithError('Failed to delete')

      const { mockDispatchHandleError } = setup()

      let onDeleteProjectCallback
      await waitFor(() => {
        const callWithLoadedData = SavedProjects.mock.calls.find(
          (call) => call[0].isLoaded === true && call[0].projects.length > 0
        )
        expect(callWithLoadedData).toBeTruthy()
        onDeleteProjectCallback = callWithLoadedData[0].onDeleteProject
        expect(typeof onDeleteProjectCallback).toBe('function')
      })

      await act(async () => {
        await onDeleteProjectCallback(projectIdToDelete)
      })

      await waitFor(() => {
        expect(mockDispatchHandleError).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.any(Error),
            action: 'handleDeleteSavedProject',
            resource: 'project',
            verb: 'deleting',
            notificationType: 'banner'
          })
        )
      })

      await waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Error deleting project. Please try again.', {
          appearance: 'error',
          autoDismiss: true
        })
      })
    })
  })

  describe('When fetching projects fails', () => {
    test('calls dispatchHandleError and shows an error toast', async () => {
      nock(/localhost/)
        .get(/projects/)
        .replyWithError('Failed to fetch')

      const { mockDispatchHandleError } = setup()

      await waitFor(() => {
        expect(mockDispatchHandleError).toHaveBeenCalledWith(
          expect.objectContaining({
            error: expect.any(Error),
            action: 'fetchProjects',
            resource: 'saved projects',
            verb: 'fetching',
            notificationType: 'banner'
          })
        )
      })

      await waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Error fetching saved projects. Please try again.', {
          appearance: 'error',
          autoDismiss: true
        })
      })
    })
  })
})
