import React from 'react'
import PropTypes from 'prop-types'
import {
  Link
} from 'react-router-dom'

import { parse } from 'qs'
import { FaTimes } from 'react-icons/fa'

import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import Button from '../Button/Button'
import { locationPropType } from '../../util/propTypes/location'
import { stringify } from '../../util/url/url'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader
 */
export const SearchSidebarHeader = ({
  portal,
  location,
  onChangePath
  // onLoadPortalConfig
}) => {
  const { title, logo, portalId } = portal

  if (portalId === 'edsc') {
    return (
      <header className="search-sidebar-header">
        <SearchFormContainer />
      </header>
    )
  }

  const params = parse(location.search, { parseArrays: false, ignoreQueryPrefix: true })
  let { p = '' } = params
  p = p.replace(/^[^!]*/, '')

  const newSearch = stringify({
    ...params,
    p
  })

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
          <Link to={`/search${newSearch}`}>
            <Button
              className="search-sidebar-header__button"
              icon={FaTimes}
              variant="link"
              title="Exit Portal"
              label="Exit Portal"
              onClick={() => {
                onChangePath(`/search${newSearch}`)
              }}
            >
              Exit Portal
            </Button>
          </Link>

        </div>
      </section>
      <SearchFormContainer />
    </header>
  )
}

SearchSidebarHeader.propTypes = {
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  // onLoadPortalConfig: PropTypes.func.isRequired,
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
