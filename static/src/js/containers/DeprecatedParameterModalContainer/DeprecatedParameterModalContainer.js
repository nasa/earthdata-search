import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import DeprecatedParameterModal from '../../components/DeprecatedParameterModal/DeprecatedParameterModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.deprecatedParameterModal.isOpen,
  deprecatedUrlParams: state.ui.deprecatedParameterModal.deprecatedUrlParams
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleDeprecatedParameterModal:
    (state) => dispatch(actions.toggleDeprecatedParameterModal(state))
})

export const DeprecatedParameterModalContainer = ({
  deprecatedUrlParams,
  isOpen,
  onToggleDeprecatedParameterModal
}) => (
  <DeprecatedParameterModal
    deprecatedUrlParams={deprecatedUrlParams}
    isOpen={isOpen}
    onToggleDeprecatedParameterModal={onToggleDeprecatedParameterModal}
  />
)

DeprecatedParameterModalContainer.propTypes = {
  deprecatedUrlParams: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleDeprecatedParameterModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(DeprecatedParameterModalContainer)
