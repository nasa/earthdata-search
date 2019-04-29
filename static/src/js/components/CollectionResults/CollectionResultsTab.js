import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class GranuleResultsTab extends PureComponent {
  render() {
    const { collectionHits } = this.props

    return (
      <>
        {`${collectionHits} Matching Collections`}
      </>
    )
  }
}

GranuleResultsTab.defaultProps = {
  collectionHits: null
}

GranuleResultsTab.propTypes = {
  collectionHits: PropTypes.string
}

export default GranuleResultsTab
