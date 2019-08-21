import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CollectionResultsHeader from '../../components/CollectionResults/CollectionResultsHeader'

const mapStateToProps = state => ({
  portal: state.portal
})

export const CollectionResultsHeaderContainer = ({ portal }) => (
  <CollectionResultsHeader portal={portal} />
)

CollectionResultsHeaderContainer.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(CollectionResultsHeaderContainer)
