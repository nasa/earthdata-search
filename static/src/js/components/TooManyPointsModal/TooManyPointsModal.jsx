import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import './TooManyPointsModal.scss'

export class TooManyPointsModal extends Component {
  constructor(props) {
    super(props)
    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleTooManyPointsModal } = this.props
    onToggleTooManyPointsModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    const body = (
      <p>
        To improve search performance, your shapefile has been simplified.
        Your original shapefile will be used for spatial subsetting if you
        choose to enable that setting during download.
      </p>
    )

    return (
      <EDSCModalContainer
        className="too-many-points"
        title="Shape file has too many points"
        isOpen={isOpen}
        id="too-many-points"
        size="md"
        onClose={this.onModalClose}
        body={body}
      />
    )
  }
}

TooManyPointsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleTooManyPointsModal: PropTypes.func.isRequired
}

export default TooManyPointsModal
