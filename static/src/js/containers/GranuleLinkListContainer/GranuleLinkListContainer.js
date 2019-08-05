import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import GranuleLinkList from '../../components/GranuleLinkList/GranuleLinkList'

const mapStateToProps = state => ({
  authToken: state.authToken,
  granuleDownload: state.granuleDownload
})

const mapDispatchToProps = dispatch => ({
  onFetchRetrievalCollection:
    (retrievalCollectionId, authToken) => dispatch(
      actions.fetchRetrievalCollection(retrievalCollectionId, authToken)
    )
})

export const GranuleLinkListContainer = ({
  authToken,
  match,
  onFetchRetrievalCollection,
  granuleDownload
}) => {
  const { params } = match
  const { id: retrievalCollectionId } = params

  return (
    <GranuleLinkList
      authToken={authToken}
      retrievalCollectionId={retrievalCollectionId}
      onFetchRetrievalCollection={onFetchRetrievalCollection}
      granuleDownload={granuleDownload}
    />
  )
}

GranuleLinkListContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  granuleDownload: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleLinkListContainer)
)
