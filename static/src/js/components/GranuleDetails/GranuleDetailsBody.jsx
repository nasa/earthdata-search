import React from 'react'
import PropTypes from 'prop-types'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedGranule } from '../../zustand/selectors/granule'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.authToken - The authToken for the logged in user
 */
const GranuleDetailsBody = ({
  authToken
}) => {
  const granuleMetadata = useEdscStore(getFocusedGranule)
  const { metadataUrls } = granuleMetadata

  return (
    <div
      className="granule-details-body"
      data-testid="granule-details-body"
    >
      <Tabs defaultActiveKey="information">
        <Tab eventKey="information" title="Information">
          <GranuleDetailsInfo granuleMetadata={granuleMetadata} />
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
}

GranuleDetailsBody.defaultProps = {
  authToken: null
}

GranuleDetailsBody.propTypes = {
  authToken: PropTypes.string
}

export default GranuleDetailsBody
