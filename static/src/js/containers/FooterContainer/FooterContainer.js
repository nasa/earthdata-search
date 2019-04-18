import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ConnectedTimelineContainer from '../TimelineContainer/TimelineContainer'
import './FooterContainer.scss'

const mapStateToProps = state => ({
  loadTime: state.entities.collections.loadTime
})

class FooterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { loadTime } = this.props

    return (
      <React.Fragment>
        <ConnectedTimelineContainer />
        <footer className="footer">
          <span className="footer__info footer__info--left">
            <span className="footer__ver-pill">v Research</span>
            <span className="footer__info-bit footer__info-bit--emph">
              Search Time:
              {(loadTime / 1000).toFixed(1)}
              s
            </span>
            <span className="footer__info-bit footer__info-bit--emph">
              NASA Official: Stephen Barrick
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
  loadTime: PropTypes.number
}

export default connect(mapStateToProps)(FooterContainer)
