/* eslint-disable react/prop-types */
import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import actions from '../../actions'

import { locationPropType } from '../../util/propTypes/location'
import { getProjectCollectionsRequiringChunking } from '../../selectors/project'

import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ProjectCollectionsContainer
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
import ProjectPanelsContainer from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'
import SavedProjectsContainer from '../../containers/SavedProjectsContainer/SavedProjectsContainer'
import Spinner from '../../components/Spinner/Spinner'

const EdscMapContainer = lazy(() => import('../../containers/MapContainer/MapContainer'))

const mapDispatchToProps = (dispatch) => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval()),
  onToggleChunkedOrderModal:
    (isOpen) => dispatch(actions.toggleChunkedOrderModal(isOpen))
})

const mapStateToProps = (state) => ({
  projectCollectionsRequiringChunking: getProjectCollectionsRequiringChunking(state),
  name: state.savedProject.name,
  project: state.project

})

export const Project = (props) => {
  const {
    onSubmitRetrieval,
    onToggleChunkedOrderModal,
    projectCollectionsRequiringChunking
  } = props

  const handleSubmit = (event) => {
    event.preventDefault()

    if (Object.keys(projectCollectionsRequiringChunking).length > 0) {
      onToggleChunkedOrderModal(true)
    } else {
      onSubmitRetrieval()
    }
  }

  const {
    location,
    name,
    project
  } = props

  console.log('🚀 ~ file: Project.js:60 ~ Project ~ project:', project)
  console.log('🚀 ~ file: Project.js:57 ~ Project ~ location:', location)
  const { search } = location
  const { edscHost } = getEnvironmentConfig()
  // TODO this does have an issue though because you can have empty projects
  // If there are no params in the URL, show the saved projects page
  // const isProject = /^(\?p).*/
  // Show the project page
  if (search !== '') {
    console.log(' I AM IN HERE💀')

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

  // Show the Saved projects page
  console.log('Im gonna be rendering the saved projects page ✅')

  return (
    <>
      <Helmet>
        <title>Saved Projects</title>
        <meta name="title" content="Saved Projects" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/projects`} />
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

Project.propTypes = {
  location: locationPropType.isRequired,
  name: PropTypes.string.isRequired,
  projectCollectionsRequiringChunking: PropTypes.shape({}).isRequired,
  onToggleChunkedOrderModal: PropTypes.func.isRequired,
  onSubmitRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Project)
)
