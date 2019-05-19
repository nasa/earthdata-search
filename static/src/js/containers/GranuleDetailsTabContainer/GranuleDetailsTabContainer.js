import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import GranuleDetailsTab from '../../components/GranuleDetails/GranuleDetailsTab'

import actions from '../../actions/index'

const mapDispatchToProps = dispatch => ({
  onFocusedGranuleChange:
    collectionId => dispatch(actions.changeFocusedGranule(collectionId))
})

export const GranuleDetailsTabContainer = ({ onFocusedGranuleChange }) => (
  <GranuleDetailsTab
    onFocusedGranuleChange={onFocusedGranuleChange}
  />
)

GranuleDetailsTabContainer.propTypes = {
  onFocusedGranuleChange: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(GranuleDetailsTabContainer)
