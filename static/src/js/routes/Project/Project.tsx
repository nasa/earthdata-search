import React, { lazy, Suspense } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
// @ts-expect-error This file does not have types
import actions from '../../actions'

// @ts-expect-error This file does not have types
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ProjectCollectionsContainer
  // @ts-expect-error This file does not have types
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
// @ts-expect-error This file does not have types
import ProjectPanelsContainer from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModalContainer
  from '../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer'

import Spinner from '../../components/Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsRequiringChunking } from '../../zustand/selectors/project'
import { getSavedProjectName } from '../../zustand/selectors/savedProject'

const EdscMapContainer = lazy(() => import('../../containers/MapContainer/MapContainer'))

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onSubmitRetrieval:
    () => dispatch(actions.submitRetrieval()),
  onToggleChunkedOrderModal:
    (isOpen: boolean) => dispatch(actions.toggleChunkedOrderModal(isOpen))
})

const { edscHost } = getEnvironmentConfig()

interface ProjectProps {
  onSubmitRetrieval: () => void
  onToggleChunkedOrderModal: (isOpen: boolean) => void
}

/**
 * The Project route component
*/
export const Project: React.FC<ProjectProps> = ({
  onSubmitRetrieval,
  onToggleChunkedOrderModal
}) => {
  const name = useEdscStore(getSavedProjectName)
  const projectCollectionsRequiringChunking = useEdscStore(getProjectCollectionsRequiringChunking)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Object.keys(projectCollectionsRequiringChunking).length > 0) {
      onToggleChunkedOrderModal(true)
    } else {
      onSubmitRetrieval()
    }
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

export default connect(null, mapDispatchToProps)(Project)
