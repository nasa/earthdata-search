import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import { Tabs, Tab } from 'react-bootstrap'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.metadataUrls -
 * @param {object} props.ummJson - The raw UMM JSON for the selected granule.
 */
const GranuleDetailsBody = ({
  authToken,
  metadataUrls,
  ummJson
}) => (
  <SimpleBar className="granule-details-body">
    <Tabs defaultActiveKey="information">
      <Tab eventKey="information" title="Information">
        <GranuleDetailsInfo ummJson={ummJson} />
      </Tab>
      <Tab eventKey="metadata" title="Metadata">
        <GranuleDetailsMetadata
          authToken={authToken}
          metadataUrls={metadataUrls}
        />
      </Tab>
    </Tabs>
  </SimpleBar>
)

GranuleDetailsBody.defaultProps = {
  authToken: null,
  metadataUrls: null,
  ummJson: null
}

GranuleDetailsBody.propTypes = {
  authToken: PropTypes.string,
  metadataUrls: PropTypes.shape({}),
  ummJson: PropTypes.shape({})
}

export default GranuleDetailsBody
