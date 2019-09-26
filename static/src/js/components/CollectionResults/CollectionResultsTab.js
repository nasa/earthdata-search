import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { commafy } from '../../util/commafy'

class CollectionResultsTab extends PureComponent {
  render() {
    let { collectionHits } = this.props

    if (collectionHits === null) {
      collectionHits = 0
    }

    return (
      <>
        {`${commafy(collectionHits)} Matching Collections`}
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
