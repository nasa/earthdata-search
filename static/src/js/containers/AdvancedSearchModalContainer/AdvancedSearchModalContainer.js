import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import AdvancedSearchModal from '../../components/AdvancedSearchModal/AdvancedSearchModal'

const mapStateToProps = state => ({
  isOpen: state.ui.advancedSearchModal.isOpen
})

const mapDispatchToProps = dispatch => ({
  onToggleAdvancedSearchModal:
    state => dispatch(actions.toggleAdvancedSearchModal(state))
})

export const AdvancedSearchModalContainer = ({
  isOpen,
  onToggleAdvancedSearchModal
}) => (
  <AdvancedSearchModal
    isOpen={isOpen}
    onToggleAdvancedSearchModal={onToggleAdvancedSearchModal}
  />
)

AdvancedSearchModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchModalContainer)
