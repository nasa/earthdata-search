import React from 'react'
import PropTypes from 'prop-types'
import { FaTimes } from 'react-icons/fa'

import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import Button from '../Button/Button'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader
 */
export const SearchSidebarHeader = ({
  portal
}) => {
  const { title, logo, portalId } = portal

  if (portalId === 'edsc') {
    return (
      <header className="search-sidebar-header">
        <SearchFormContainer />
      </header>
    )
  }

  const { primary: primaryTitle, secondary: secondaryTitle } = title
  const { id: logoId, link: logoLink } = logo

  let logoEl

  if (logoId) {
    logoEl = (
      <div className="search-sidebar-header__thumbnail-container">
        <div className="search-sidebar-header__thumbnail" id={logoId} />
      </div>
    )
  }

  if (logoLink) {
    logoEl = (
      <a target="_blank" rel="noreferrer" href={logoLink}>
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
          <Button
            className="search-sidebar-header__button"
            icon={FaTimes}
            variant="link"
            title="Exit Portal"
            label="Exit Portal"
          >
            Exit Portal
          </Button>
        </div>
      </section>
      <SearchFormContainer />
    </header>
  )
}

SearchSidebarHeader.propTypes = {
  // location: locationPropType.isRequired,
  // onFocusedCollectionChange: PropTypes.func.isRequired,
  portal: PropTypes.shape({
    title: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string
    }),
    logo: PropTypes.shape({
      id: PropTypes.string,
      link: PropTypes.string
    }).isRequired,
    portalId: PropTypes.string
  }).isRequired
}

export default SearchSidebarHeader
