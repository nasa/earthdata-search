import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useLocation, useNavigationType } from 'react-router-dom'
import PropTypes from 'prop-types'

import { virtualPageview } from '../../middleware/metrics/events'

import { metricsClick } from '../../middleware/metrics/actions'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsClick: (data) => dispatch(metricsClick(data))
})

/**
 * This component handles metrics tracking for user interactions. It handles click events and
 * virtual pageviews.
 * @param {Function} params.onMetricsClick Function to handle metrics click events
 */
export const MetricsContainer = ({ onMetricsClick }) => {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Handle click events
  const handleMetricsClick = (event) => {
    const { target } = event

    const clickableParent = target.closest('a, button')

    if (!clickableParent) return

    const title = target.title || target.text || target.name || target.textContent

    onMetricsClick({
      elementLabel: title
    })
  }

  // Set up click event listener
  useEffect(() => {
    document.body.addEventListener('click', handleMetricsClick)

    return () => {
      document.body.removeEventListener('click', handleMetricsClick)
    }
  }, [])

  // Handle virtual pageviews when the location changes. This uses navigationType to determine
  // if the pageview was a `push` type.
  useEffect(() => {
    virtualPageview(navigationType)
  }, [location, navigationType])

  return null
}

MetricsContainer.propTypes = {
  onMetricsClick: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(MetricsContainer)
