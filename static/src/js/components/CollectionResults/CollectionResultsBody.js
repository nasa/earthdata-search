import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import CollectionResultsList from './CollectionResultsList'

import './CollectionResultsBody.scss'

/**
 * Renders CollectionResultsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 * @param {object} props.location - Locations passed from react router.
 * @param {function} props.onFocusedCollectionChange - Fired when a new collection is focused.
 */
class CollectionResultsBody extends PureComponent {
  render() {
    const {
      collections,
      waypointEnter,
      onViewCollectionGranules,
      onViewCollectionDetails
    } = this.props

    return (
      <div className="collection-results-body">
        <CollectionResultsList
          collections={collections}
          onViewCollectionGranules={onViewCollectionGranules}
          onViewCollectionDetails={onViewCollectionDetails}
          waypointEnter={waypointEnter}
        />
      </div>
    )
  }
}

CollectionResultsBody.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsBody
