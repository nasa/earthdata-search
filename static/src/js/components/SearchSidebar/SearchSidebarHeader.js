import React from 'react'
import PropTypes from 'prop-types'
import { FaTimes } from 'react-icons/fa'

import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { locationPropType } from '../../util/propTypes/location'

import './SearchSidebarHeader.scss'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

/**
 * Renders SearchSidebarHeader
 */
export const SearchSidebarHeader = ({
  portal,
  location
}) => {
  const {
    title = {},
    hasLogo,
    portalId,
    moreInfoUrl
  } = portal

  if (portalId === getApplicationConfig().defaultPortal) {
    return (
      <header className="search-sidebar-header">
        <SearchFormContainer />
      </header>
    )
  }

  const { primary: primaryTitle, secondary: secondaryTitle } = title

  let logoEl

  if (hasLogo) {
    logoEl = (
      <div className="search-sidebar-header__thumbnail-container">
        <div
          className="search-sidebar-header__thumbnail"
          id="portal-logo"
          data-testid="portal-logo"
        />
      </div>
    )
  }

  if (moreInfoUrl) {
    logoEl = (
      <a
        target="_blank"
        rel="noreferrer"
        href={moreInfoUrl}
        data-testid="portal-logo-link"
      >
        {logoEl}
      </a>
    )
  }

  return (
    <header className="search-sidebar-header">
      <section className="search-sidebar-header__header">
        {logoEl}
        <div className="search-sidebar-header__primary">
          <h2
            className="search-sidebar-header__heading"
            title={`${primaryTitle}${secondaryTitle && ` (${secondaryTitle})`}`}
          >
            {primaryTitle}
            {
              secondaryTitle && (
                <>
                  {' '}
                  <span className="search-sidebar-header__heading-secondary">
                    {`(${secondaryTitle})`}
                  </span>
                </>
              )
            }
          </h2>
          <PortalLinkContainer
            newPortal={{}}
            className="search-sidebar-header__button"
            icon={FaTimes}
            variant="link"
            type="button"
            title="Exit Portal"
            label="Exit Portal"
            to={location}
            updatePath
          >
            Exit Portal
          </PortalLinkContainer>

        </div>
      </section>
      <SearchFormContainer />
    </header>
  )
}

SearchSidebarHeader.propTypes = {
  location: locationPropType.isRequired,
  portal: PropTypes.shape({
    title: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string
    }),
    hasLogo: PropTypes.bool,
    moreInfoUrl: PropTypes.string,
    portalId: PropTypes.string
  }).isRequired
}

export default SearchSidebarHeader
