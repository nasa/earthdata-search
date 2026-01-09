import React from 'react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import DownloadHistory from '../../components/DownloadHistory/DownloadHistory'

const { edscHost } = getEnvironmentConfig()

/**
 * The Downloads route component
*/
const Downloads = () => (
  <>
    <Helmet>
      <title>Downloads</title>
      <meta name="title" content="Downloads" />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${edscHost}`} />
    </Helmet>

    <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
      <div className="route-wrapper__content">
        <div className="route-wrapper__content-inner">
          <DownloadHistory />
        </div>
      </div>
    </div>
  </>
)

export default Downloads
