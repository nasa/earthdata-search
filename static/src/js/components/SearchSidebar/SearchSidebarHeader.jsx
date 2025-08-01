import React, { useCallback, useState } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaDoorOpen } from 'react-icons/fa'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { usePortalLogo } from '../../hooks/usePortalLogo'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader
 */
export const SearchSidebarHeader = () => {
  const location = useLocation()

  const portal = useEdscStore((state) => state.portal)
  const {
    title = {},
    portalId,
    moreInfoUrl
  } = portal

  const portalLogoSrc = usePortalLogo(portalId)

  const [thumbnailLoading, setThumbnailLoading] = useState(true)

  const onThumbnailLoaded = useCallback(() => {
    setThumbnailLoading(false)
  })

  if (portalId === getApplicationConfig().defaultPortal) {
    return (
      <header className="search-sidebar-header">
        <SearchFormContainer />
      </header>
    )
  }

  const { primary: primaryTitle, secondary: secondaryTitle } = title

  const displayTitle = `${primaryTitle}${secondaryTitle && ` (${secondaryTitle})`}`

  const portalLogoClassNames = classNames(
    'search-sidebar-header__thumbnail',
    {
      'search-sidebar-header__thumbnail--is-loaded': !thumbnailLoading
    }
  )

  let logoEl

  if (portalLogoSrc === undefined || portalLogoSrc) {
    logoEl = (
      <div className="search-sidebar-header__thumbnail-container">
        {
          thumbnailLoading && (
            <Spinner
              dataTestId="portal-logo-spinner"
              type="dots"
              className="search-sidebar-header__thumb-spinner"
              color="gray"
              size="x-tiny"
            />
          )
        }
        {
          portalLogoSrc && (
            <img
              className={portalLogoClassNames}
              src={portalLogoSrc}
              height="30"
              width="30"
              data-testid="portal-logo"
              alt={`A logo for ${displayTitle}`}
              onLoad={() => onThumbnailLoaded()}
            />
          )
        }
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
        overlay={
          (
            <Tooltip className="tooltip--auto">
              Find more information about
              {' '}
              {displayTitle}
              <EDSCIcon className="search-sidebar-header__portal-tooltip-icon edsc-icon-ext-link edsc-icon-fw" icon="edsc-icon-ext-link edsc-icon-fw" />
            </Tooltip>
          )
        }
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

export default SearchSidebarHeader
