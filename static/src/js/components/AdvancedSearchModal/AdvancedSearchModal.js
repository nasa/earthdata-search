import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EDSCModal from '../EDSCModal/EDSCModal'

import './AdvancedSearchModal.scss'

export class AdvancedSearchModal extends Component {
  constructor(props) {
    super(props)

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onApplyClick() {
    const { onToggleAdvancedSearchModal } = this.props
    onToggleAdvancedSearchModal(false)
  }

  onCancelClick() {
    const { onToggleAdvancedSearchModal } = this.props
    onToggleAdvancedSearchModal(false)
  }

  onModalClose() {
    const { onToggleAdvancedSearchModal } = this.props
    onToggleAdvancedSearchModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    return (
      <EDSCModal
        className="advanced-search-modal"
        title="Advanced Search"
        isOpen={isOpen}
        id="advanced-search"
        size="lg"
        onClose={this.onModalClose}
        body={<>Advanced Search</>}
        primaryAction="Apply"
        onPrimaryAction={this.onApplyClick}
        secondaryAction="Cancel"
        onSecondaryAction={this.onCancelClick}
      />
    )
  }
}

AdvancedSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default AdvancedSearchModal
