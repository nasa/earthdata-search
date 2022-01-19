import React from 'react'
import PropTypes from 'prop-types'

import { Tabs, Tab } from 'react-bootstrap'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.authToken - The authToken for the logged in user
 * @param {Object} props.granuleMetadata - The formatted metadata from CMR
 */
const GranuleDetailsBody = ({
  authToken,
  earthdataEnvironment,
  granuleMetadata
}) => {
  const { metadataUrls } = granuleMetadata

  return (
    <div
      className="granule-details-body"
      data-test-id="granule-details-body"
    >
      <Tabs defaultActiveKey="information">
        <Tab eventKey="information" title="Information">
          <GranuleDetailsInfo granuleMetadata={granuleMetadata} />
        </Tab>
        <Tab eventKey="metadata" title="Metadata">
          <GranuleDetailsMetadata
            authToken={authToken}
            earthdataEnvironment={earthdataEnvironment}
            metadataUrls={metadataUrls}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

GranuleDetailsBody.defaultProps = {
  authToken: null
}

GranuleDetailsBody.propTypes = {
  authToken: PropTypes.string,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleMetadata: PropTypes.shape({
    metadataUrls: PropTypes.shape({})
  }).isRequired
}

export default GranuleDetailsBody
