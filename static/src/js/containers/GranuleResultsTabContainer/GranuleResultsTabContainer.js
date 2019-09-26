import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import GranuleResultsTab from '../../components/GranuleResults/GranuleResultsTab'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

export const GranuleResultsTabContainer = ({ location, onFocusedCollectionChange }) => (
  <GranuleResultsTab
    location={location}
    onFocusedCollectionChange={onFocusedCollectionChange}
  />
)
GranuleResultsTabContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(GranuleResultsTabContainer)
)
