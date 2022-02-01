import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Route, Switch, withRouter } from 'react-router-dom'

import actions from '../../actions'

import CollectionDownloadDisplay from '../../components/CollectionDownloadDisplay/CollectionDownloadDisplay'

export const mapStateToProps = (state) => ({
  authToken: state.authToken,
  retrieval: state.retrieval
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchRetrieval:
    (retrievalId, authToken) => dispatch(
      actions.fetchRetrieval(retrievalId, authToken)
    ),
  onFetchRetrievalCollectionGranuleLinks:
    (retrievalCollection) => dispatch(
      actions.fetchRetrievalCollectionGranuleLinks(retrievalCollection)
    )
})

export class CollectionContainer extends Component {
  componentDidMount() {
    const {
      match,
      onFetchRetrieval
    } = this.props

    const { params } = match
    const { id: retrievalId } = params

    if (retrievalId) {
      onFetchRetrieval(retrievalId)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      match,
      onFetchRetrieval
    } = this.props

    const { params } = match
    const { id: retrievalId } = params

    const {
      match: nextMatch
    } = nextProps

    const { params: nextParams } = nextMatch
    const { id: nextRetrievalId } = nextParams

    if (nextRetrievalId && (retrievalId !== nextRetrievalId)) {
      onFetchRetrieval(nextRetrievalId)
    }
  }

  render() {
    const {
      match,
      onFetchRetrievalCollectionGranuleLinks,
      retrieval
    } = this.props

    const { params, path } = match

    // Pull the retrieval collection from the store
    const { id } = params

    const { collections = {} } = retrieval
    const { byId = {} } = collections
    const { [id]: retrievalCollection = {} } = byId

    return (
      <Switch>
        <Route exact path={[`${path}/links`, `${path}/script`]}>
          <CollectionDownloadDisplay
            onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
            retrievalCollection={retrievalCollection}
          />
        </Route>
      </Switch>
    )
  }
}

CollectionContainer.propTypes = {
  retrieval: PropTypes.shape({
    collections: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    }),
    path: PropTypes.string
  }).isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionContainer)
)
