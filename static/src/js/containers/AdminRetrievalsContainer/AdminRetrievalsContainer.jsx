import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import AdminRetrievals from '../../components/AdminRetrievals/AdminRetrievals'

export const mapStateToProps = (state) => ({
  retrievals: state.admin.retrievals,
  retrievalsLoading: state.admin.retrievals.isLoading,
  retrievalsLoaded: state.admin.retrievals.isLoaded
})

export const mapDispatchToProps = (dispatch) => ({
  onAdminViewRetrieval:
    (retrievalId) => dispatch(actions.adminViewRetrieval(retrievalId)),
  onFetchAdminRetrievals:
    () => dispatch(actions.fetchAdminRetrievals()),
  onUpdateAdminRetrievalsSortKey:
    (sortKey) => dispatch(
      actions.updateAdminRetrievalsSortKey(sortKey)
    ),
  onUpdateAdminRetrievalsPageNum:
    (pageNum) => dispatch(
      actions.updateAdminRetrievalsPageNum(pageNum)
    )
})

export const AdminRetrievalsContainer = ({
  onAdminViewRetrieval,
  onFetchAdminRetrievals,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPageNum,
  retrievals
}) => {
  useEffect(() => {
    onFetchAdminRetrievals()
  }, [])

  return (
    <AdminRetrievals
      onAdminViewRetrieval={onAdminViewRetrieval}
      onFetchAdminRetrievals={onFetchAdminRetrievals}
      onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
      onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
      retrievals={retrievals}
    />
  )
}

AdminRetrievalsContainer.defaultProps = {
  retrievals: {}
}

AdminRetrievalsContainer.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onFetchAdminRetrievals: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminRetrievalsContainer)
