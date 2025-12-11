import React, { lazy, Suspense } from 'react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import SidebarContainer from '../../containers/SidebarContainer/SidebarContainer'
import ProjectCollectionsContainer
  // @ts-expect-error This file does not have types
  from '../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'
// @ts-expect-error This file does not have types
import ProjectPanelsContainer from '../../containers/ProjectPanelsContainer/ProjectPanelsContainer'
import OverrideTemporalModal from '../../components/OverrideTemporalModal/OverrideTemporalModal'

import Spinner from '../../components/Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'
import { getProjectCollectionsRequiringChunking } from '../../zustand/selectors/project'
import { getSavedProjectName } from '../../zustand/selectors/savedProject'

import { useCreateRetrieval } from '../../hooks/useCreateRetrieval'
import { setOpenModalFunction } from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

const EdscMapContainer = lazy(() => import('../../containers/MapContainer/MapContainer'))

const { edscHost } = getEnvironmentConfig()

/**
 * The Project route component
*/
const Project = () => {
  const { createRetrieval } = useCreateRetrieval()
  const name = useEdscStore(getSavedProjectName)
  const projectCollectionsRequiringChunking = useEdscStore(getProjectCollectionsRequiringChunking)
  const setOpenModal = useEdscStore(setOpenModalFunction)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (Object.keys(projectCollectionsRequiringChunking).length > 0) {
      setOpenModal(MODAL_NAMES.CHUNKED_ORDER)
    } else {
      createRetrieval()
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
        <OverrideTemporalModal />
      </form>

      <Suspense fallback={<Spinner type="dots" className="root__spinner spinner spinner--dots spinner--white spinner--small" />}>
        <EdscMapContainer />
      </Suspense>
    </>
  )
}

export default Project
