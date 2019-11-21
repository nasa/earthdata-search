import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './GranuleResultsTab.scss'

/**
 * Renders GranuleResultsTab.
 * @param {object} props - The props passed into the component.
 * @param {object} location - The location passed into the component from React Router.
 * @param {object} props.onFocusedCollectionChange - Function to call to reset the focused collection.
 */
export class GranuleResultsTab extends PureComponent {
  render() {
    const { location, onFocusedCollectionChange } = this.props

    return (
      <span className="granule-results-tab">
        <PortalLinkContainer
          className="granule-results-tab__button"
          type="button"
          label="Back to Collections"
          to={{
            pathname: '/search',
            search: location.search
          }}
          onClick={() => onFocusedCollectionChange('')}
        >
          <i className="fa fa-chevron-circle-left" />
          {' Back to Collections'}
        </PortalLinkContainer>
      </span>
    )
  }
}

GranuleResultsTab.propTypes = {
  location: PropTypes.shape({}).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default GranuleResultsTab
