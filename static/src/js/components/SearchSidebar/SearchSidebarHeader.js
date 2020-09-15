import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { locationPropType } from '../../util/propTypes/location'

import SearchFormContainer from '../../containers/SearchFormContainer/SearchFormContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './SearchSidebarHeader.scss'

/**
 * Renders SearchSidebarHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} location - The location passed into the component from React Router.
 * @param {object} props.onFocusedCollectionChange - Function to call to reset the focused collection.
 */
export class SearchSidebarHeader extends PureComponent {
  render() {
    const { location, onFocusedCollectionChange } = this.props

    const linkWrapperClassNames = classNames([
      'search-sidebar-header__link-wrapper',
      {
        'search-sidebar-header__link-wrapper--is-active': !location.pathname.endsWith('/search')
      }
    ])

    return (
      <div className="search-sidebar-header">
        <div className={linkWrapperClassNames}>
          <PortalLinkContainer
            className="search-sidebar-header__button"
            type="button"
            label="Back to collections"
            to={{
              pathname: '/search',
              search: location.search
            }}
            onClick={() => onFocusedCollectionChange('')}
          >
            <i className="fa fa-chevron-left" />
            {' Back to collections'}
          </PortalLinkContainer>
        </div>
        <SearchFormContainer />
      </div>
    )
  }
}

SearchSidebarHeader.propTypes = {
  location: locationPropType.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default SearchSidebarHeader
