import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import isPath from '../../util/isPath'

import ConnectedTimelineContainer from '../TimelineContainer/TimelineContainer'

import './FooterContainer.scss'

const mapStateToProps = state => ({
  loadTime: state.searchResults.collections.loadTime
})

export class FooterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { loadTime, location } = this.props
    const searchTimeVisible = isPath(location.pathname, ['/search', '/projects'])
    const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

    const {
      env: edscEnv,
      version: edscVersion
    } = getApplicationConfig()

    return (
      <React.Fragment>
        <ConnectedTimelineContainer />
        <footer className="footer">
          <span className="footer__info footer__info--left">
            <span className="footer__ver-pill">
              {
                edscEnv !== 'prod' && (
                  <span className="footer__env">
                    {edscEnv.toUpperCase()}
                  </span>
                )
              }
              {`v${edscVersion}`}
            </span>
            {(searchTimeVisible && loadTime !== 0) && (
              <span className="footer__info-bit footer__info-bit--emph">
                {`Search Time: ${loadTimeInSeconds}s`}
              </span>
            ) }
            <span className="footer__info-bit footer__info-bit--emph">
              NASA Official: Stephen Berrick
            </span>
            <span className="footer__info-bit">
              <a
                className="footer__info-link"
                href="http://www.nasa.gov/FOIA/index.html"
              >
                FOIA
              </a>
            </span>
            <span className="footer__info-bit">
              <a
                className="footer__info-link"
                href="http://www.nasa.gov/about/highlights/HP_Privacy.html"
              >
                NASA Privacy Policy
              </a>
            </span>
            <span className="footer__info-bit">
              <a className="footer__info-link" href="http://www.usa.gov">USA.gov</a>
            </span>
          </span>
          <span className="footer__info footer__info--right">
            <span className="footer__info-bit footer__info-bit--clean footer__info-bit--emph">
              <a
                className="footer__info-link footer__info-link--underline"
                href="https://access.earthdata.nasa.gov/"
              >
                Earthdata Access: A Section 508 accessible alternative
              </a>
            </span>
          </span>
        </footer>
      </React.Fragment>
    )
  }
}

FooterContainer.defaultProps = {
  loadTime: 0
}

FooterContainer.propTypes = {
  loadTime: PropTypes.number,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(FooterContainer)
)
