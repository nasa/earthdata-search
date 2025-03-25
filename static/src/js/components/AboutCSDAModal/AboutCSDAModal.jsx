import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import ExternalLink from '../ExternalLink/ExternalLink'

export class AboutCSDAModal extends Component {
  constructor(props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this)
  }

  onModalClose() {
    const { onToggleAboutCSDAModal } = this.props
    onToggleAboutCSDAModal(false)
  }

  render() {
    const {
      isOpen
    } = this.props

    const body = (
      <>
        <p>
          {'The Commercial Smallsat Data Acquisition (CSDA) Program was established to identify, evaluate, and acquire data from commercial sources that support NASA\'s Earth science research and application goals. NASA\'s Earth Science Division (ESD) recognizes the potential impact commercial small-satellite (smallsat) constellations may have in encouraging/enabling efficient approaches to advancing Earth System Science and applications development for societal benefit.'}
        </p>

        <div>
          <p>
            { /* eslint-disable-next-line max-len */}
            Here are some places where you can find more information about the Commercial Smallsat Data Acquisition (CSDA) Program:
          </p>
          <ul>
            <li>
              <ExternalLink href="https://earthdata.nasa.gov/esds/csdap/">
                Commercial Smallsat Data Acquisition (CSDA) Program
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://earthdata.nasa.gov/esds/csdap/faq-commercial-data/">
                Accessing and Requesting Commercial Smallsat Data FAQ
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://csdap.earthdata.nasa.gov/signup/">
                CSDA Program Authorization Request Form
              </ExternalLink>
            </li>
          </ul>
        </div>

        <hr />

        <div>
          <h4>How do I access this data?</h4>
          <p>
            { /* eslint-disable-next-line max-len */}
            Users that meet the requirements set forth by NASA for access to Commercial Smallsat Data Acquisition (CSDA) Program data can request access to the program
            {' '}
            <ExternalLink href="https://csdap.earthdata.nasa.gov/signup/">
              here
            </ExternalLink>
            { /* eslint-disable-next-line max-len */}
            . Once access has been approved and an account has been created, users can use their account credentials when downloading data from Earthdata Search.
          </p>
        </div>
      </>
    )

    return (
      <EDSCModalContainer
        className="about-csda"
        id="about-csda"
        isOpen={isOpen}
        onClose={this.onModalClose}
        size="lg"
        title="What's the NASA Commercial Smallsat Data Acquisition (CSDA) Program?"
        body={body}
      />
    )
  }
}

AboutCSDAModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default AboutCSDAModal
