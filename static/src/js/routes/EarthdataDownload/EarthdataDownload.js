import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import EarthdataDownloadContainer from '../../containers/EddLandingPageContainer/EarthdataDownloadContainer'

export const EarthdataDownload = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>EarthdataDownload</title>
        <meta name="title" content="EarthdataDownload" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/earthdataDownload`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <EarthdataDownloadContainer />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(EarthdataDownload)
