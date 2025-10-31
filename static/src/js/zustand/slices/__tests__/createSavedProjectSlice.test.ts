import useEdscStore from '../../useEdscStore'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import getApolloClient from '../../../providers/getApolloClient'
import CREATE_PROJECT from '../../../operations/mutations/createProject'
import UPDATE_PROJECT from '../../../operations/mutations/updateProject'

import routerHelper from '../../../router/router'
import GET_PROJECT from '../../../operations/queries/getProject'

jest.mock('../../../providers/getApolloClient', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    query: jest.fn()
  })
}))

jest.mock('../../../store/configureStore', () => jest.fn())

describe('createSavedProjectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { savedProject } = zustandState

    expect(savedProject).toEqual({
      project: {
        id: undefined,
        name: undefined,
        path: undefined
      },
      setProject: expect.any(Function),
      setProjectName: expect.any(Function),
      getProject: expect.any(Function)
    })
  })

  describe('setProject', () => {
    test('sets the project', () => {
      const zustandState = useEdscStore.getState()
      const { savedProject } = zustandState
      const { setProject } = savedProject
      setProject({
        id: '12345',
        name: 'Test Project',
        path: '/search?p=!C12345-EDSC'
      })

      const updatedState = useEdscStore.getState()
      const { savedProject: updatedSavedProject } = updatedState
      expect(updatedSavedProject.project).toEqual({
        id: '12345',
        name: 'Test Project',
        path: '/search?p=!C12345-EDSC'
      })
    })
  })

  describe('setProjectName', () => {
    describe('when there is no existing project', () => {
      test('creates a new project', async () => {
        const mockMutate = jest.fn().mockResolvedValue({
          data: {
            createProject: {
              name: 'Test Project',
              obfuscatedId: '12345',
              path: '/search'
            }
          }
        })

        getApolloClient.mockReturnValue({
          mutate: mockMutate
        })

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        if (routerHelper.router) {
          routerHelper.router.state = {
            location: {
              pathname: '/search',
              search: ''
            }
          }
        }

        const zustandState = useEdscStore.getState()
        const { savedProject } = zustandState
        const { setProjectName } = savedProject
        await setProjectName('Test Project')

        expect(mockMutate).toHaveBeenCalledTimes(1)
        expect(mockMutate).toHaveBeenCalledWith({
          mutation: CREATE_PROJECT,
          variables: {
            name: 'Test Project',
            path: '/search'
          }
        })

        const updatedState = useEdscStore.getState()
        const { savedProject: updatedSavedProject } = updatedState
        expect(updatedSavedProject.project).toEqual({
          id: '12345',
          name: 'Test Project',
          path: '/search'
        })

        expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
        expect(routerHelper.router?.navigate).toHaveBeenCalledWith('/search?projectId=12345', { replace: true })
      })
    })

    describe('when there is an existing project', () => {
      test('updates the existing project', async () => {
        const mockMutate = jest.fn().mockResolvedValue({
          data: {
            updateProject: {
              name: 'Test Project',
              obfuscatedId: '12345',
              path: '/search?p=!C12345-EDSC'
            }
          }
        })

        getApolloClient.mockReturnValue({
          mutate: mockMutate
        })

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        if (routerHelper.router) {
          routerHelper.router.state = {
            location: {
              pathname: '/search',
              search: '?projectId=12345'
            }
          }
        }

        useEdscStore.setState((state) => {
          state.savedProject.project = {
            id: '12345',
            path: '/search?p=!C12345-EDSC'
          }
        })

        const zustandState = useEdscStore.getState()
        const { savedProject } = zustandState
        const { setProjectName } = savedProject
        await setProjectName('Test Project')

        expect(mockMutate).toHaveBeenCalledTimes(1)
        expect(mockMutate).toHaveBeenCalledWith({
          mutation: UPDATE_PROJECT,
          variables: {
            name: 'Test Project',
            obfuscatedId: '12345',
            path: '/search?p=!C12345-EDSC'
          }
        })

        const updatedState = useEdscStore.getState()
        const { savedProject: updatedSavedProject } = updatedState
        expect(updatedSavedProject.project).toEqual({
          id: '12345',
          name: 'Test Project',
          path: '/search?p=!C12345-EDSC'
        })

        expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the mutation fails', () => {
      test('calls handleError', async () => {
        const mockMutate = jest.fn().mockRejectedValue(new Error('Mock mutation error'))

        getApolloClient.mockReturnValue({
          mutate: mockMutate
        })

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        if (routerHelper.router) {
          routerHelper.router.state = {
            location: {
              pathname: '/search',
              search: ''
            }
          }
        }

        useEdscStore.setState((state) => {
          state.errors.handleError = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { savedProject } = zustandState
        const { setProjectName } = savedProject

        await setProjectName('Test Project')

        expect(mockMutate).toHaveBeenCalledTimes(1)
        expect(mockMutate).toHaveBeenCalledWith({
          mutation: CREATE_PROJECT,
          variables: {
            name: 'Test Project',
            path: '/search'
          }
        })

        const { errors } = useEdscStore.getState()
        expect(errors.handleError).toHaveBeenCalledTimes(1)
        expect(errors.handleError).toHaveBeenCalledWith({
          action: 'setProjectName',
          error: new Error('Mock mutation error'),
          resource: 'project name',
          verb: 'updating'
        })
      })
    })
  })

  describe('getProject', () => {
    test('fetches the project and sets it in the state', async () => {
      const mockQuery = jest.fn().mockResolvedValue({
        data: {
          project: {
            name: 'Test Project',
            obfuscatedId: '12345',
            path: '/search?p=!C12345-EDSC'
          }
        }
      })

      getApolloClient.mockReturnValue({
        query: mockQuery
      })

      const zustandState = useEdscStore.getState()
      const { savedProject } = zustandState
      const { getProject } = savedProject

      await getProject('12345')

      expect(mockQuery).toHaveBeenCalledTimes(1)
      expect(mockQuery).toHaveBeenCalledWith({
        query: GET_PROJECT,
        variables: {
          obfuscatedId: '12345'
        }
      })

      const updatedState = useEdscStore.getState()
      const { savedProject: updatedSavedProject } = updatedState
      expect(updatedSavedProject.project).toEqual({
        id: '12345',
        name: 'Test Project',
        path: '/search?p=!C12345-EDSC'
      })
    })

    describe('when the request fails', () => {
      test('calls handleError', async () => {
        const mockQuery = jest.fn().mockRejectedValue(new Error('Mock query error'))

        getApolloClient.mockReturnValue({
          query: mockQuery
        })

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        useEdscStore.setState((state) => {
          state.errors.handleError = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { savedProject } = zustandState
        const { getProject } = savedProject

        await getProject('12345')

        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith({
          query: GET_PROJECT,
          variables: {
            obfuscatedId: '12345'
          }
        })

        const { errors } = useEdscStore.getState()
        expect(errors.handleError).toHaveBeenCalledTimes(1)
        expect(errors.handleError).toHaveBeenCalledWith({
          action: 'getProject',
          error: new Error('Mock query error'),
          resource: 'project',
          verb: 'fetching'
        })
      })
    })

    describe('when the project path starts with /projects', () => {
      test('navigates to the /project path with the projectId in the URL', async () => {
        const mockQuery = jest.fn().mockResolvedValue({
          data: {
            project: {
              name: 'Test Project',
              obfuscatedId: '12345',
              path: '/projects?p=!C12345-EDSC'
            }
          }
        })

        getApolloClient.mockReturnValue({
          query: mockQuery
        })

        const mockDispatch = jest.fn()
        configureStore.mockReturnValue({
          dispatch: mockDispatch,
          getState: () => ({
            authToken: 'mock-token'
          })
        })

        if (routerHelper.router) {
          routerHelper.router.state = {
            location: {
              pathname: '/projects',
              search: ''
            }
          }
        }

        const zustandState = useEdscStore.getState()
        const { savedProject } = zustandState
        const { getProject } = savedProject

        await getProject('12345')

        expect(mockQuery).toHaveBeenCalledTimes(1)
        expect(mockQuery).toHaveBeenCalledWith({
          query: GET_PROJECT,
          variables: {
            obfuscatedId: '12345'
          }
        })

        const updatedState = useEdscStore.getState()
        const { savedProject: updatedSavedProject } = updatedState
        expect(updatedSavedProject.project).toEqual({
          id: '12345',
          name: 'Test Project',
          path: '/project?p=!C12345-EDSC'
        })

        expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
        expect(routerHelper.router?.navigate).toHaveBeenCalledWith('/project?projectId=12345', { replace: true })
      })
    })
  })
})
