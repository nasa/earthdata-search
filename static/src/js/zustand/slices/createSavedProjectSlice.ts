import routerHelper, { type Router } from '../../router/router'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { SavedProjectSlice, ImmerStateCreator } from '../types'

// @ts-expect-error Types are not defined for this module
import ProjectRequest from '../../util/request/projectRequest'

// @ts-expect-error Types are not defined for this module
import configureStore from '../../store/configureStore'

// @ts-expect-error Types are not defined for this module
import actions from '../../actions'

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

    setProjectName: (name) => {
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

      const earthdataEnvironment = getEarthdataEnvironment(currentState)

      const { location } = routerHelper.router?.state || {} as Router['state']
      const { pathname, search } = location

      // If there isn't a path saved yet, get it from the URL
      let realPath = path
      if (!path) realPath = pathname + search

      const requestObject = new ProjectRequest(undefined, earthdataEnvironment)

      requestObject.save({
        authToken,
        name,
        path: realPath,
        projectId: savedProjectId
      })
        .then((responseObject: unknown) => {
          const { data } = responseObject as { data: { project_id: string; path: string } }
          const {
            project_id: projectId,
            path: pathData
          } = data

          get().savedProject.setProject({
            id: projectId,
            name,
            path: pathData
          })

          // If the URL didn't contain a projectId before, change the URL to a project URL
          if (search.indexOf('?projectId=') === -1) {
            const router = routerHelper.router as Router
            router.navigate(`${pathname}?projectId=${projectId}`, { replace: true })
          }
        })
        .catch((error: Error) => {
          reduxDispatch(actions.handleError({
            error,
            action: 'updateProjectName',
            resource: 'project name',
            verb: 'updating',
            requestObject
          }))
        })
    },

    getProject: () => get().project
  }
})

export default createSavedProjectSlice
