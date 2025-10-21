import React from 'react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'
import { Navigate, useLocation } from 'react-router-dom'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import SavedProjectsContainer from '../../containers/SavedProjectsContainer/SavedProjectsContainer'

const { edscHost } = getEnvironmentConfig()

/**
 * The Projects route component
*/
const Projects = () => {
  const location = useLocation()
  const { search } = location

  // If there are query parameters then redirect to /project keeping the parameters
  // const searchParams = new URLSearchParams(window.location.search)
  if (search) {
    return <Navigate to={`/project${search}`} replace />
  }

  return (
    <>
      <Helmet>
        <title>Saved Projects</title>
        <meta name="title" content="Saved Projects" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}`} />
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

export default Projects
