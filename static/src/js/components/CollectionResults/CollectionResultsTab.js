import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class CollectionResultsTab extends PureComponent {
  render() {
    const { collectionHits } = this.props

    return (
      <>
        {`${collectionHits} Matching Collections`}
      </>
    )
  }
}

CollectionResultsTab.defaultProps = {
  collectionHits: null
}

CollectionResultsTab.propTypes = {
  collectionHits: PropTypes.string
}

export default CollectionResultsTab
