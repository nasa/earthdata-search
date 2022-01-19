import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrieval from '../../components/AdminRetrieval/AdminRetrieval'

export const mapStateToProps = (state) => ({
  retrievals: state.admin.retrievals.byId
})

export const mapDispatchToProps = (dispatch) => ({
  onFetchAdminRetrieval: (id) => dispatch(actions.fetchAdminRetrieval(id))
})

export class AdminRetrievalContainer extends Component {
  componentDidMount() {
    const {
      match,
      onFetchAdminRetrieval
    } = this.props

    const { params } = match
    const { id } = params

    onFetchAdminRetrieval(id)
  }

  render() {
    const {
      match,
      retrievals
    } = this.props

    const { params } = match
    const { id } = params

    const { [id]: selectedRetrieval } = retrievals

    return (
      <AdminRetrieval
        retrieval={selectedRetrieval}
      />
    )
  }
}

AdminRetrievalContainer.defaultProps = {
  retrievals: {}
}

AdminRetrievalContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  onFetchAdminRetrieval: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalContainer)
)
