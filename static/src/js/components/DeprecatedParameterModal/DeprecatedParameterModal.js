import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import './DeprecatedParameterModal.scss'

export class DeprecatedParameterModal extends Component {
  constructor(props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleDeprecatedParameterModal } = this.props
    onToggleDeprecatedParameterModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    const body = (
      <>
        <p>
          {`Occasionally, we need to make changes to our supported URL parameters. 
          We've updated the URL in your browser, so you don't need to do anything. 
          If you've used a bookmark to navigate here, consider updating the bookmark 
          to use the new URL.`}
        </p>
        <p className="mb-0">
          {'Please visit the '}
          <a href="https://wiki.earthdata.nasa.gov/display/EDSC/Earthdata+Search+URL+Parameters">Earthdata Search URL Parameters</a>
          {' wiki page for more information on the supported URL parameters.'}
        </p>
      </>
    )

    return (
      <EDSCModalContainer
        id="deprecated-parameter-modal"
        className="deprecated-parameter-modal"
        isOpen={isOpen}
        onClose={this.onModalClose}
        title="Oops! It looks like you've used an old web address..."
        size="lg"
        body={body}
      />
    )
  }
}

DeprecatedParameterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleDeprecatedParameterModal: PropTypes.func.isRequired
}

export default DeprecatedParameterModal
