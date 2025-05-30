import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import EarthdataDownloadRedirectComponent from '../../components/EarthdataDownloadRedirectContainer/EarthdataDownloadRedirect'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export const EarthdataDownloadRedirect = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>Earthdata Download Redirect</title>
        <meta name="title" content="Earthdata Download Redirect" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/earthdata-download-redirect`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page route-wrapper--content-page-centered">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <EarthdataDownloadRedirectComponent />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(EarthdataDownloadRedirect)
