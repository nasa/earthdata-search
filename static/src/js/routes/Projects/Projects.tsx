import React from 'react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import SavedProjects from '../../components/SavedProjects/SavedProjects'

const { edscHost } = getEnvironmentConfig()

/**
 * The Projects route component
*/
const Projects = () => (
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
          <SavedProjects />
        </div>
      </div>
    </div>
  </>
)

export default Projects
