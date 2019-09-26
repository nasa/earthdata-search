import React from 'react'
import PropTypes from 'prop-types'

import ProjectPanelSection from './ProjectPanelSection'

/**
 * Renders CollectionDetails.
 * @param {object} props - The props passed into the component.
 */
export const CollectionDetails = ({ granuleCount }) => (
  <ProjectPanelSection heading={`Granules (${granuleCount} Total)`} />
)

CollectionDetails.defaultProps = {
  granuleCount: 0
}

CollectionDetails.propTypes = {
  granuleCount: PropTypes.number
}

export default CollectionDetails
