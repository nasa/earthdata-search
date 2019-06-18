import React from 'react'
import PropTypes from 'prop-types'

import ProjectPanelSection from './ProjectPanelSection'

/**
 * Renders CollectionDetails.
 * @param {object} props - The props passed into the component.
 */
export const CollectionDetails = ({ granuleCount }) => (
  <ProjectPanelSection heading={`Granules (${granuleCount} Total)`}>
    Some collection details
  </ProjectPanelSection>
)

CollectionDetails.propTypes = {
  granuleCount: PropTypes.number.isRequired
}

export default CollectionDetails
