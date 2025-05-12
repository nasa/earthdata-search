import React from 'react'
import {
  screen,
  waitFor,
  act
} from '@testing-library/react'
import nock from 'nock'

import actions from '../../../actions'
import { getEarthdataEnvironment } from '../../../selectors/earthdataEnvironment'
import { addToast } from '../../../util/addToast'
import {
  mapStateToProps,
  mapDispatchToProps,
  SavedProjectsContainer
} from '../SavedProjectsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock(
  '../../../containers/PortalLinkContainer/PortalLinkContainer',
  () => jest.fn(({ children }) => (
    <mock-PortalLinkContainer>{children}</mock-PortalLinkContainer>
  ))
)

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
    test('fetches the projects and displays them', async () => {
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

      expect(await screen.findByText('Project 1')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /remove project/i })).toBeInTheDocument()
    })
  })

  describe('When the authToken is null', () => {
    test('renders no projects', async () => {
      setup({
        overrideProps: {
          authToken: null
        }
      })

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /remove project/i })).toBeNull()
      })
    })
  })

  describe('When deleting a project', () => {
    const projectId = '123'

    test('successfully deletes the project and shows a success toast', async () => {
      const mockProjects = [
        {
          id: projectId,
          name: 'Project 1',
          path: '/search?p=!C123',
          created_at: '2022-01-01T00:00:00.000Z'
        }
      ]

      nock(/localhost/)
        .get(/projects/)
        .reply(200, mockProjects)

      nock(/localhost/)
        .delete(`/projects/${projectId}`)
        .reply(204)

      window.confirm = jest.fn(() => true)

      const { user } = setup()

      const removeBtn = await screen.findByRole('button', { name: /remove project/i })

      await act(async () => {
        await user.click(removeBtn)
      })

      expect(addToast).toHaveBeenCalledTimes(1)
      await waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })

    test('handles an error during project deletion', async () => {
      const mockProjects = [
        {
          id: projectId,
          name: 'Project 1',
          path: '/search?p=!C123',
          created_at: '2022-01-01T00:00:00.000Z'
        }
      ]

      nock(/localhost/)
        .get(/projects/)
        .reply(200, mockProjects)

      nock(/localhost/)
        .delete(`/projects/${projectId}`)
        .replyWithError('Failed to delete')

      window.confirm = jest.fn(() => true)

      const { user, props } = setup()

      const removeBtn = await screen.findByRole('button', { name: /remove project/i })

      await act(async () => {
        await user.click(removeBtn)
      })

      await waitFor(() => {
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

      expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
    })
  })

  describe('When fetching projects fails', () => {
    test('calls dispatchHandleError with the correct error data', async () => {
      nock(/localhost/)
        .get(/projects/)
        .replyWithError('Failed to fetch')

      const { props } = setup()

      await waitFor(() => {
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

      expect(props.dispatchHandleError).toHaveBeenCalledTimes(1)
    })
  })
})
