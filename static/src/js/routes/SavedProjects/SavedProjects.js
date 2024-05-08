import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import SavedProjectsContainer from '../../containers/SavedProjectsContainer/SavedProjectsContainer'
import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'

export const SavedProjects = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <AuthRequiredContainer>
      <Helmet>
        <title>Saved Projects</title>
        <meta name="title" content="Saved Projects" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/projects`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <SavedProjectsContainer />
          </div>
        </div>
      </div>
    </AuthRequiredContainer>
  )
}

export default withRouter(SavedProjects)
