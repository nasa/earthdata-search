import { gql } from '@apollo/client'

import routerHelper, { type Router } from '../../router/router'
import { SavedProjectSlice, ImmerStateCreator } from '../types'

// @ts-expect-error Types are not defined for this module
import getApolloClient from '../../providers/getApolloClient'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import actions from '../../actions'

import CREATE_PROJECT from '../../operations/mutations/createProject'
import UPDATE_PROJECT from '../../operations/mutations/updateProject'

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
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken
      } = reduxState

      const currentState = get()
      const { savedProject } = currentState
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

      const apolloClient = getApolloClient(authToken)

      let mutation = CREATE_PROJECT
      let mutationKey = 'createProject'
      if (savedProjectId) {
        mutation = UPDATE_PROJECT
        mutationKey = 'updateProject'
      }

      try {
        const { data } = await apolloClient.mutate({
          mutation: gql(mutation),
          variables: {
            name,
            path: realPath,
            obfuscatedId: savedProjectId
          }
        })

        const { [mutationKey]: projectResponse } = data
        const { obfuscatedId } = projectResponse

        get().savedProject.setProject({
          id: obfuscatedId,
          name,
          path: realPath
        })

        // If the URL didn't contain a projectId before, change the URL to a project URL
        if (search.indexOf('?projectId=') === -1) {
          const router = routerHelper.router as Router
          router.navigate(`${pathname}?projectId=${obfuscatedId}`, { replace: true })
        }
      } catch (error) {
        const { message } = error as Error

        if (message) {
          reduxDispatch(actions.handleError({
            error: message,
            action: 'setProjectName',
            resource: 'project name',
            verb: 'updating'
          }))
        }
      }
    },

    getProject: () => get().project
  }
})

export default createSavedProjectSlice
