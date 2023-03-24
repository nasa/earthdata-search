import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import actions from '../../actions'
import history from '../../util/history'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (portalId) => dispatch(actions.changePath(portalId))
})

export const BackButtonContainer = ({ onChangePath }) => {
  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      // If the action is POP (browser back or forward buttons), call onChangePath to reset the store
      // with the new location values
      if (action === 'POP') {
        const { pathname, search } = location

        onChangePath(`${pathname}${search}`)
      }
    })

    return () => {
      unlisten()
    }
  }, [])

  return null
}

BackButtonContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(BackButtonContainer)
