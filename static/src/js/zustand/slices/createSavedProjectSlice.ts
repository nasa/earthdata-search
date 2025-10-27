import routerHelper, { type Router } from '../../router/router'
import { SavedProjectSlice, ImmerStateCreator } from '../types'

// @ts-expect-error Types are not defined for this module
import getApolloClient from '../../providers/getApolloClient'

import CREATE_PROJECT from '../../operations/mutations/createProject'
import UPDATE_PROJECT from '../../operations/mutations/updateProject'
import GET_PROJECT from '../../operations/queries/getProject'

import { getAuthToken, getEdlToken } from '../selectors/user'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

const createSavedProjectSlice: ImmerStateCreator<SavedProjectSlice> = (set, get) => ({
  savedProject: {
    project: {
      id: undefined,
      name: undefined,
      path: undefined
    },

    setProject: (project) => {
      set((state) => {
        state.savedProject.project = project
      })
    },

    setProjectName: async (name) => {
      const zustandState = get()
      const authToken = getAuthToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const edlToken = getEdlToken(zustandState)

      const { savedProject } = zustandState
      const { project: previousProject } = savedProject
      const {
        path,
        id: savedProjectId
      } = previousProject

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { pathname, search } = location

      // If there isn't a path saved yet, get it from the URL
      let realPath = path
      if (!path) realPath = pathname + search

      const apolloClient = getApolloClient({
        authToken,
        earthdataEnvironment,
        edlToken
      })

      let mutation = CREATE_PROJECT
      let mutationKey = 'createProject'
      if (savedProjectId) {
        mutation = UPDATE_PROJECT
        mutationKey = 'updateProject'
      }

      try {
        const { data } = await apolloClient.mutate({
          mutation,
          variables: {
            name,
            path: realPath,
            obfuscatedId: savedProjectId
          }
        })

        const { [mutationKey]: projectResponse } = data
        const {
          name: projectName,
          obfuscatedId,
          path: projectPath
        } = projectResponse

        get().savedProject.setProject({
          id: obfuscatedId,
          name: projectName,
          path: projectPath
        })

        // If the URL didn't contain a projectId before, change the URL to a project URL
        if (search.indexOf('?projectId=') === -1) {
          const router = routerHelper.router as Router
          router.navigate(`${pathname}?projectId=${obfuscatedId}`, { replace: true })
        }
      } catch (error) {
        const { message } = error as Error

        if (message) {
          zustandState.errors.handleError({
            error: error as Error,
            action: 'setProjectName',
            resource: 'project name',
            verb: 'updating'
          })
        }
      }
    },

    getProject: async (projectId) => {
      const zustandState = get()
      const authToken = getAuthToken(zustandState)
      const earthdataEnvironment = getEarthdataEnvironment(zustandState)
      const edlToken = getEdlToken(zustandState)

      const apolloClient = getApolloClient({
        authToken,
        earthdataEnvironment,
        edlToken
      })

      try {
        const { data } = await apolloClient.query({
          query: GET_PROJECT,
          variables: {
            obfuscatedId: projectId
          }
        })

        const { project } = data
        const {
          name,
          obfuscatedId: newProjectId,
          path: projectPath
        } = project

        let updatedProjectPath = projectPath

        // If projectPath starts with /projects change it to /project and navigate to that URL
        if (projectPath.startsWith('/projects')) {
          updatedProjectPath = projectPath.replace('/projects', '/project')

          const newUrl = `${updatedProjectPath.split('?')[0]}?projectId=${newProjectId}`

          const router = routerHelper.router as Router
          router.navigate(newUrl, { replace: true })
        }

        // Save name, path and id into store
        get().savedProject.setProject({
          id: newProjectId,
          name,
          path: updatedProjectPath
        })
      } catch (error) {
        const { message } = error as Error

        if (message) {
          get().errors.handleError({
            error: error as Error,
            action: 'getProject',
            resource: 'project',
            verb: 'fetching'
          })
        }
      }
    }
  }
})

export default createSavedProjectSlice
