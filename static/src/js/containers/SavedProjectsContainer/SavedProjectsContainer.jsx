import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import { SavedProjects } from '../../components/SavedProjects/SavedProjects'
import ProjectRequest from '../../util/request/projectRequest'
import { addToast } from '../../util/addToast'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

export const mapStateToProps = (state) => ({
  authToken: state.authToken
})

export const mapDispatchToProps = (dispatch) => ({
  onChangePath: (path) => dispatch(actions.changePath(path)),
  dispatchHandleError: (errorConfig) => dispatch(actions.handleError(errorConfig))
})

export const SavedProjectsContainer = ({
  onChangePath,
  authToken,
  dispatchHandleError
}) => {
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setIsLoaded(false)

    if (!authToken) {
      setIsLoading(false)
      setProjects([])

      return
    }

    try {
      const requestObject = new ProjectRequest(authToken, earthdataEnvironment)
      const response = await requestObject.all()
      setProjects(response.data)
      setIsLoaded(true)
    } catch (error) {
      dispatchHandleError({
        error,
        action: 'fetchProjects',
        resource: 'saved projects',
        verb: 'fetching',
        notificationType: 'banner'
      })
    } finally {
      setIsLoading(false)
    }
  }, [authToken, earthdataEnvironment, dispatchHandleError])

  const handleDeleteSavedProject = useCallback(async (projectId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this project? This action cannot be undone.')) {
      try {
        const requestObject = new ProjectRequest(authToken, earthdataEnvironment)
        await requestObject.remove(projectId)
        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId))
        addToast('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (error) {
        dispatchHandleError({
          error,
          action: 'handleDeleteSavedProject',
          resource: 'project',
          verb: 'deleting',
          notificationType: 'banner'
        })
      }
    }
  }, [authToken, earthdataEnvironment, dispatchHandleError])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return (
    <SavedProjects
      projects={projects}
      isLoading={isLoading}
      isLoaded={isLoaded}
      onChangePath={onChangePath}
      onDeleteProject={handleDeleteSavedProject}
    />
  )
}

SavedProjectsContainer.defaultProps = {
  authToken: null
}

SavedProjectsContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  authToken: PropTypes.string,
  dispatchHandleError: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SavedProjectsContainer)
)
