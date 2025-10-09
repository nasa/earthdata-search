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
  const { search = '' } = location

  // If there is a project collection in the search params then redirect to /project keeping the parameters
  const searchParams = new URLSearchParams(search)
  const projectCollection = searchParams.get('p')?.split('!')[1]
  if (projectCollection) {
    return <Navigate to={`/project${search}`} replace />
  }

  // If there is a search parameter that doesn't include the `p` parameter, then redirect to /projects
  // without including the search params
  if (search) {
    return <Navigate to="/projects" replace />
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
