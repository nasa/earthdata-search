import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import EarthdataDownloadComponent from '../../components/EarthdataDownload/EarthdataDownload'

export const EarthdataDownload = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>Earthdata Download</title>
        <meta name="title" content="Earthdata Download" />
        <link rel="canonical" href={`${edscHost}/earthdata-download`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <EarthdataDownloadComponent />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(EarthdataDownload)
