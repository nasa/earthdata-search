import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'

import TimelineContainer from '../TimelineContainer/TimelineContainer'
import { FooterLink } from '../../components/FooterLink/FooterLink'

import './FooterContainer.scss'

export const mapStateToProps = (state) => ({
  loadTime: state.searchResults.collections.loadTime,
  portal: state.portal
})

export class FooterContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      loadTime,
      location,
      portal
    } = this.props
    const { footer = {} } = portal

    const searchTimeVisible = isPath(location.pathname, ['/search', '/projects'])
    const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

    const {
      attributionText = '',
      displayVersion,
      primaryLinks: primaryLinksArray = [],
      secondaryLinks: secondaryLinksArray = []
    } = footer

    const pillClassNames = classNames([
      {
        footer__env: displayVersion
      }
    ])

    const {
      env: edscEnv,
      version: edscVersion
    } = getApplicationConfig()

    const version = () => {
      if (displayVersion) {
        return `v${edscVersion}`
      }

      return null
    }

    const searchTime = () => {
      if (searchTimeVisible && loadTime !== 0) {
        return (
          <span className="footer__info-bit footer__info-bit--emph">
            {`Search Time: ${loadTimeInSeconds}s`}
          </span>
        )
      }

      return null
    }

    const attribution = () => {
      if (attributionText) {
        return (
          <span className="footer__info-bit footer__info-bit--emph">
            {attributionText}
          </span>
        )
      }

      return null
    }

    const primaryLinks = () => primaryLinksArray.map((link) => {
      const { href, title } = link
      return (
        <FooterLink
          key={href}
          href={href}
          title={title}
        />
      )
    })

    const secondaryLinks = () => secondaryLinksArray.map((link) => {
      const { href, title } = link
      return (
        <FooterLink
          key={href}
          href={href}
          title={title}
          secondary
        />
      )
    })

    return (
      <>
        <TimelineContainer />
        <footer className="footer">
          <span className="footer__info footer__info--left">
            <span className="footer__ver-pill">
              {
                edscEnv !== 'prod' && (
                  <span className={pillClassNames}>
                    {edscEnv.toUpperCase()}
                  </span>
                )
              }
              {version()}
            </span>
            {searchTime()}
            {attribution()}
            {primaryLinks()}
          </span>
          <span className="footer__info footer__info--right">
            {secondaryLinks()}
          </span>
        </footer>
      </>
    )
  }
}

FooterContainer.defaultProps = {
  loadTime: 0
}

FooterContainer.propTypes = {
  loadTime: PropTypes.number,
  location: locationPropType.isRequired,
  portal: PropTypes.shape({
    footer: PropTypes.shape({})
  }).isRequired
}

export default withRouter(
  connect(mapStateToProps)(FooterContainer)
)
