import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import EddLandingPageContainer from '../../containers/EddLandingPageContainer/EddLandingPageContainer'

export const EddLandingPage = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>EddLandingPage</title>
        <meta name="title" content="EddLandingPage" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/eddLandingPage`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <EddLandingPageContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(EddLandingPage)
