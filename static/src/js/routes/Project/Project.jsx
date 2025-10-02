import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import actions from '../../actions'

import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ProjectCollectionsContainer
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import ProjectPanelsContainer from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
import SavedProjectsContainer from '../../containers/SavedProjectsContainer/SavedProjectsContainer'

import Spinner from '../../components/Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsRequiringChunking } from '../../zustand/selectors/project'
import { getSavedProjectName } from '../../zustand/selectors/savedProject'

const EdscMapContainer = lazy(() => import('../../containers/MapContainer/MapContainer'))

const mapDispatchToProps = (dispatch) => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval()),
  onToggleChunkedOrderModal:
    (isOpen) => dispatch(actions.toggleChunkedOrderModal(isOpen))
})

/**
 * The Project route component
*/
export const Project = (props) => {
  const location = useLocation()

  const name = useEdscStore(getSavedProjectName)
  const projectCollectionsRequiringChunking = useEdscStore(getProjectCollectionsRequiringChunking)

  const {
    onSubmitRetrieval,
    onToggleChunkedOrderModal
  } = props

  const handleSubmit = (event) => {
    event.preventDefault()

    if (Object.keys(projectCollectionsRequiringChunking).length > 0) {
      onToggleChunkedOrderModal(true)
    } else {
      onSubmitRetrieval()
    }
  }

  const { search } = location
  const { edscHost } = getEnvironmentConfig()

  // If there are no params in the URL, show the saved projects page
  if (search === '') {
    return (
      <>
        <Helmet>
          <title>Saved Projects</title>
          <meta data-testid="meta-title" name="title" content="Saved Projects" />
          <meta data-testid="meta-robots" name="robots" content="noindex, nofollow" />
          <link data-testid="canonical-link" rel="canonical" href={`${edscHost}`} />
        </Helmet>
        <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
          <div className="route-wrapper__content">
            <div className="route-wrapper__content-inner">
              <SavedProjectsContainer />
            </div>
          </div>
        </div>
      </>
    )
  }

  // Show the project page
  return (
    <>
      <Helmet>
        <title>{name || 'Untitled Project'}</title>
        <meta name="title" content={name || 'Untitled Project'} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}`} />
      </Helmet>
      <form
        id="form__project"
        onSubmit={handleSubmit}
        method="post"
        name="project form"
        className="route-wrapper route-wrapper--dark"
      >
        <SidebarContainer panels={<ProjectPanelsContainer />}>
          <ProjectCollectionsContainer />
        </SidebarContainer>
        <OverrideTemporalModalContainer />
      </form>
      <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--white spinner--small" />}>
        <EdscMapContainer />
      </Suspense>
    </>
  )
}

Project.propTypes = {
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Project)
