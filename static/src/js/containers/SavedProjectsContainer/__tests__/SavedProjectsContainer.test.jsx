import React from 'react'
import { waitFor, act } from '@testing-library/react'
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
import setupTest from '../../../../../../jestConfigs/setupTest'

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

const setup = setupTest({
  Component: SavedProjectsContainer,
  defaultProps: {
    authToken: 'TEST_TOKEN_DEFAULT',
    earthdataEnvironment: 'uat',
    onChangePath: jest.fn(),
    dispatchHandleError: jest.fn()
  }
})

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
  describe('When the component mounts with a valid authToken', () => {
    test('fetches the projects and renders SavedProjects with projects', async () => {
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
        expect(SavedProjects).toHaveBeenCalledTimes(5)
      })

      expect(SavedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          projects: mockProjects,
          isLoaded: true,
          isLoading: false,
          onDeleteProject: expect.any(Function)
        }),
        {}
      )
    })
  })

  describe('When the authToken is null', () => {
    test('renders SavedProjects with no projects', async () => {
      setup({
        overrideProps: {
          authToken: null
        }
      })

      await waitFor(() => {
        expect(SavedProjects).toHaveBeenCalledTimes(2)
      })

      expect(SavedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          projects: [],
          isLoaded: false,
          isLoading: false
        }),
        {}
      )
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

      await waitFor(() => {
        expect(SavedProjects).toHaveBeenCalledTimes(5)
      })

      expect(SavedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          projects: mockProjects,
          isLoaded: true,
          isLoading: false
        }),
        {}
      )

      const { onDeleteProject } = SavedProjects.mock.calls[SavedProjects.mock.calls.length - 1][0]

      await act(async () => {
        await onDeleteProject(projectIdToDelete)
      })

      await waitFor(() => {
        expect(addToast).toHaveBeenCalledTimes(1)
      })

      expect(addToast).toHaveBeenCalledWith('Project removed', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(nock.isDone()).toBe(true)
    })

    test('handles error during project deletion and shows an error', async () => {
      nock(/localhost/)
        .delete(`/projects/${projectIdToDelete}`)
        .replyWithError('Failed to delete')

      const { props } = setup()

      await waitFor(() => {
        expect(SavedProjects).toHaveBeenCalledTimes(5)
      })

      expect(SavedProjects).toHaveBeenCalledWith(
        expect.objectContaining({
          projects: mockProjects,
          isLoaded: true,
          isLoading: false
        }),
        {}
      )

      const { onDeleteProject } = SavedProjects.mock.calls[SavedProjects.mock.calls.length - 1][0]

      await act(async () => {
        await onDeleteProject(projectIdToDelete)
      })

      await waitFor(() => {
        expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
      })

      expect(props.dispatchHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          action: 'handleDeleteSavedProject',
          resource: 'project',
          verb: 'deleting',
          notificationType: 'banner'
        })
      )

      await waitFor(() => {
        expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
      })

      expect(props.dispatchHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          action: 'handleDeleteSavedProject',
          resource: 'project',
          verb: 'deleting',
          notificationType: 'banner'
        })
      )
    })
  })

  describe('When fetching projects fails', () => {
    test('calls dispatchHandleError with the correct error data', async () => {
      nock(/localhost/)
        .get(/projects/)
        .replyWithError('Failed to fetch')

      const { props } = setup()

      await waitFor(() => {
        expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
      })

      expect(props.dispatchHandleError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.any(Error),
          action: 'fetchProjects',
          resource: 'saved projects',
          verb: 'fetching',
          notificationType: 'banner'
        })
      )
    })
  })
})
