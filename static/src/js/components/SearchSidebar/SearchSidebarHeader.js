import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FaDoorOpen } from 'react-icons/fa'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { locationPropType } from '../../util/propTypes/location'
import { usePortalLogo } from '../../hooks/usePortalLogo'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader
 */
export const SearchSidebarHeader = ({
  portal,
  location
}) => {
  const {
    title = {},
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

  const portalLogoSrc = usePortalLogo(portalId)

  const { primary: primaryTitle, secondary: secondaryTitle } = title

  const displayTitle = `${primaryTitle}${secondaryTitle && ` (${secondaryTitle})`}`

  let logoEl

  if (portalLogoSrc) {
    logoEl = (
      <div className="search-sidebar-header__thumbnail-container">
        <img
          className="search-sidebar-header__thumbnail"
          src={portalLogoSrc}
          height="30"
          width="30"
          data-testid="portal-logo"
          alt={`A logo for ${displayTitle}`}
        />
        <div className="search-sidebar-header__thumbnail-icon-wrapper">
          <EDSCIcon className="search-sidebar-header__thumbnail-icon edsc-icon-ext-link edsc-icon-fw" icon="edsc-icon-ext-link edsc-icon-fw" />
        </div>
      </div>
    )
  }

  if (moreInfoUrl && portalLogoSrc) {
    logoEl = (
      <OverlayTrigger
        placement="top"
        overlay={(
          <Tooltip className="tooltip--auto">
            Find more information about
            {' '}
            {displayTitle}
            <EDSCIcon className="search-sidebar-header__portal-tooltip-icon edsc-icon-ext-link edsc-icon-fw" icon="edsc-icon-ext-link edsc-icon-fw" />
          </Tooltip>
        )}
      >
        <a
          target="_blank"
          rel="noreferrer"
          href={moreInfoUrl}
          data-testid="portal-logo-link"
        >
          {logoEl}
        </a>
      </OverlayTrigger>
    )
  }

  return (
    <header className="search-sidebar-header">
      <section className="search-sidebar-header__header">
        {logoEl}
        <div className="search-sidebar-header__primary">
          <h2
            className="search-sidebar-header__heading"
            title={displayTitle}
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
            icon={FaDoorOpen}
            variant="link"
            type="button"
            title="Leave Portal"
            label="Leave Portal"
            to={location}
            updatePath
          >
            Leave Portal
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
    moreInfoUrl: PropTypes.string,
    portalId: PropTypes.string.isRequired
  }).isRequired
}

export default SearchSidebarHeader
