import React from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedGranule } from '../../zustand/selectors/granule'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 */
const GranuleDetailsBody = () => {
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
            metadataUrls={metadataUrls}
          />
        </Tab>
      </Tabs>
    </div>
  )
}

export default GranuleDetailsBody
