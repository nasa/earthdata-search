import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

import { metricsDefaultClick } from '../../util/metrics/metricsDefaultClick'
import { metricsVirtualPageview } from '../../util/metrics/metricsVirtualPageview'

/**
 * This component handles metrics tracking for user interactions. It handles click events and
 * virtual pageviews.
 */
const MetricsContainer = () => {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Handle click events
  const handleDefaultClick = (event) => {
    const { target } = event

    const clickableParent = target.closest('a, button')

    if (!clickableParent) return

    const title = target.title || target.text || target.name || target.textContent

    metricsDefaultClick(title)
  }

  // Set up click event listener
  useEffect(() => {
    document.body.addEventListener('click', handleDefaultClick)

    return () => {
      document.body.removeEventListener('click', handleDefaultClick)
    }
  }, [])

  // Handle virtual pageviews when the location changes. This uses navigationType to determine
  // if the pageview was a `push` type.
  useEffect(() => {
    metricsVirtualPageview(navigationType)
  }, [location, navigationType])

  return null
}

export default MetricsContainer
