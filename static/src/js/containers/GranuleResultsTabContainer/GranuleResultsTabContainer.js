import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GranuleResultsTab from '../../components/GranuleResults/GranuleResultsTab'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onFocusedCollectionChange:
    collectionId => dispatch(actions.changeFocusedCollection(collectionId))
})

export const GranuleResultsTabContainer = ({ onFocusedCollectionChange }) => (
  <GranuleResultsTab
    onFocusedCollectionChange={onFocusedCollectionChange}
  />
)
GranuleResultsTabContainer.propTypes = {
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(GranuleResultsTabContainer)
