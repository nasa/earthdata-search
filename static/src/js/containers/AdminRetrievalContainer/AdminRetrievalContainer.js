import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import AdminRetrievalDetails from '../../components/AdminRetrievalDetails/AdminRetrievalDetails'

const mapStateToProps = state => ({
  retrievals: state.admin.retrievals.data,
  retrievalsLoading: state.admin.retrievals.isLoading,
  retrievalsLoaded: state.admin.retrievals.isLoaded
})

const mapDispatchToProps = dispatch => ({
  onFetchAdminRetrieval: () => dispatch(actions.adminFetchAdminRetrievals())
})

export class AdminRetrievalContainer extends Component {
  componentDidMount() {
    const {
      onFetchAdminRetrieval
    } = this.props

    onFetchAdminRetrieval()
  }

  render() {
    const {
      onFetchAdminRetrieval
    } = this.props

    return (
      <AdminRetrievalDetails
        onFetchAdminRetrieval={onFetchAdminRetrieval}
      />
    )
  }
}

AdminRetrievalContainer.propTypes = {
  onFetchAdminRetrieval: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalContainer)
)
