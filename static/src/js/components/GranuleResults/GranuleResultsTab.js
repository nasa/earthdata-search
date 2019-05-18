import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './GranuleResultsTab.scss'

/**
 * Renders GranuleResultsTab.
 * @param {object} props - The props passed into the component.
 * @param {object} props.onFocusedCollectionChange - Function to call to reset the focused collection.
 */
export class GranuleResultsTab extends PureComponent {
  render() {
    const { onFocusedCollectionChange } = this.props

    return (
      <span className="granule-results-tab">
        <Link
          className="granule-results-tab__button"
          type="button"
          to="/search"
          onClick={() => onFocusedCollectionChange('')}
        >
          <i className="fa fa-chevron-circle-left" />
          {' Back to Collections'}
        </Link>
      </span>
    )
  }
}

GranuleResultsTab.propTypes = {
  onFocusedCollectionChange: PropTypes.func.isRequired
}

export default GranuleResultsTab
