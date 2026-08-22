import React from 'react'
import { Helmet } from 'react-helmet'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import GeoTiffInspectorApp from '../../components/GeoTiffInspectorApp/GeoTiffInspectorApp'

/**
 * The GeoTiffInspector route component
*/
export const GeoTiffInspector = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>GeoTiffInspector</title>
        <meta name="title" content="GeoTiffInspector" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <GeoTiffInspectorApp />
          </div>
        </div>
      </div>
    </>
  )
}

GeoTiffInspector.propTypes = {}

export default GeoTiffInspector
