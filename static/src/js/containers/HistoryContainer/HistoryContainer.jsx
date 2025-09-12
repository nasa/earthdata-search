import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions'
import routerHelper from '../../router/router'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (portalId) => dispatch(actions.changePath(portalId))
})

export const HistoryContainer = ({ onChangePath }) => {
  const { router } = routerHelper

  useEffect(() => {
    const unsubscribe = router.subscribe((location) => {
      const {
        historyAction,
        pathname,
        search
      } = location

      if (historyAction === 'POP') {
        onChangePath(`${pathname}${search}`)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return null
}

HistoryContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(HistoryContainer)
