import React from 'react'
import { connect } from 'react-redux'

import CollectionResultsHeader from '../../components/CollectionResults/CollectionResultsHeader'

export const CollectionDetailsHeaderContainer = () => (
  <CollectionResultsHeader />
)

export default connect(null, null)(CollectionDetailsHeaderContainer)
