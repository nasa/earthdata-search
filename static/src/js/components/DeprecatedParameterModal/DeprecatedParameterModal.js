import React, { Component } from 'react'
import PropTypes from 'prop-types'
import arrayToSentence from 'array-to-sentence'
import { Alert } from 'react-bootstrap'

import pluralize from '../../util/pluralize'
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
      deprecatedUrlParams,
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
        {
          deprecatedUrlParams.length !== 0 && (
            <Alert
              className="text-center"
              variant="warning"
            >
              {`The following URL ${pluralize('parameter', deprecatedUrlParams.length)} ${deprecatedUrlParams.length > 1 ? 'have' : 'has'} been deprecated: `}
              <span className="font-weight-bold">{arrayToSentence(deprecatedUrlParams)}</span>
            </Alert>
          )
        }
        <p className="mb-0">
          {'Please visit the '}
          <a
            className="link link--external"
            target="_blank"
            rel="noreferrer"
            href="https://wiki.earthdata.nasa.gov/display/EDSC/Earthdata+Search+URL+Parameters"
          >
            Earthdata Search URL Parameters
          </a>
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
  deprecatedUrlParams: PropTypes.arrayOf(PropTypes.string).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleDeprecatedParameterModal: PropTypes.func.isRequired
}

export default DeprecatedParameterModal
