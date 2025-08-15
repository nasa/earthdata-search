import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import AdminRetrievals from '../../components/AdminRetrievals/AdminRetrievals'

export const AdminRetrievalsContainer = (props) => {
  const {
    history
  } = props

  const {
    push: historyPush
  } = history

  return (
    <AdminRetrievals
      historyPush={historyPush}
    />
  )
}

AdminRetrievalsContainer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

export default withRouter(AdminRetrievalsContainer)
