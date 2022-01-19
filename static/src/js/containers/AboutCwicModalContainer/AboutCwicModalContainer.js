import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import AboutCwicModal from '../../components/AboutCwicModal/AboutCwicModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.aboutCwicModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleAboutCwicModal:
    (state) => dispatch(actions.toggleAboutCwicModal(state))
})

export const AboutCwicModalContainer = ({
  isOpen,
  onToggleAboutCwicModal
}) => (
  <AboutCwicModal
    isOpen={isOpen}
    onToggleAboutCwicModal={onToggleAboutCwicModal}
  />
)

AboutCwicModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutCwicModalContainer)
