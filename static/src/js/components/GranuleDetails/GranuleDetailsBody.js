import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Tab } from 'react-bootstrap'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.json - JSON built from the XML for the selected granule.
 * @param {object} props.xml - The raw XML for the selected granule.
 */
const GranuleDetailsBody = ({
  authToken,
  metadataUrls,
  xml
}) => (
  <div className="granule-details-body">
    <Tabs defaultActiveKey="information">
      <Tab eventKey="information" title="Information">
        <GranuleDetailsInfo xml={xml} />
      </Tab>
      <Tab eventKey="metadata" title="Metadata">
        <GranuleDetailsMetadata
          authToken={authToken}
          metadataUrls={metadataUrls}
        />
      </Tab>
    </Tabs>
  </div>
)

GranuleDetailsBody.propTypes = {
  authToken: PropTypes.string.isRequired,
  metadataUrls: PropTypes.shape({}).isRequired,
  xml: PropTypes.string.isRequired
}

export default GranuleDetailsBody
