import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import AboutCSDAModal from '../../components/AboutCSDAModal/AboutCSDAModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.aboutCSDAModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleAboutCSDAModal:
    (state) => dispatch(actions.toggleAboutCSDAModal(state))
})

export const AboutCSDAModalContainer = ({
  isOpen,
  onToggleAboutCSDAModal
}) => (
  <AboutCSDAModal
    isOpen={isOpen}
    onToggleAboutCSDAModal={onToggleAboutCSDAModal}
  />
)

AboutCSDAModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutCSDAModalContainer)
