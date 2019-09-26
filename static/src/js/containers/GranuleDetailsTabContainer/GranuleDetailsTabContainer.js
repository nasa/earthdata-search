import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import GranuleDetailsTab from '../../components/GranuleDetails/GranuleDetailsTab'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onFocusedGranuleChange:
    collectionId => dispatch(actions.changeFocusedGranule(collectionId))
})

export const GranuleDetailsTabContainer = ({ location, onFocusedGranuleChange }) => (
  <GranuleDetailsTab
    location={location}
    onFocusedGranuleChange={onFocusedGranuleChange}
  />
)

GranuleDetailsTabContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired
}

export default withRouter(
  connect(null, mapDispatchToProps)(GranuleDetailsTabContainer)
)
