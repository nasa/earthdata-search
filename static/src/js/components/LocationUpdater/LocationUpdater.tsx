import React, { useEffect } from 'react'
import { type Dispatch } from 'redux'
import { connect } from 'react-redux'

// Disabling the no-restricted-imports rule for this file because this
// is the one place we want to use `useLocation` and `useNavigate` directly from
// 'react-router-dom'.
// eslint-disable-next-line import-newlines/enforce
import {
  // eslint-disable-next-line no-restricted-imports
  useLocation,
  // eslint-disable-next-line no-restricted-imports
  useNavigate,
  useNavigationType
} from 'react-router-dom'

import useEdscStore from '../../zustand/useEdscStore'

// @ts-expect-error: This file does not have types
import { virtualPageview } from '../../middleware/metrics/events'

// @ts-expect-error: This file does not have types
import actions from '../../actions'
import { eventEmitter } from '../../events/events'

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  onChangePath:
    (path: string) => dispatch(actions.changePath(path))
})

interface LocationUpdaterProps {
  /** Function to change the path */
  onChangePath: (path: string) => void
}

export const LocationUpdater: React.FC<LocationUpdaterProps> = ({
  onChangePath
}) => {
  const location = useLocation()
  console.log('🚀 ~ LocationUpdater.tsx:39 ~ location:', location)
  const navigate = useNavigate()
  const navigationType = useNavigationType()

  const {
    // location: edscStoreLocation,
    // setLocation,
    setNavigate
  } = useEdscStore((state) => ({
    // location: state.location.location,
    // setLocation: state.location.setLocation,
    setNavigate: state.location.setNavigate
  }))

  // Update the Zustand store with the navigate function
  useEffect(() => {
    setNavigate(navigate)
  }, [])

  useEffect(() => {
    // setLocation(location)

    // When the location changes, generate a virtual pageview metrics event
    virtualPageview(navigationType)

    // If the navigation type is POP, need to update the store from the URL
    if (navigationType === 'POP') {
      // If the navigation type is POP, we want to update the path in the store
      // This is useful for browser back/forward navigation
      const { pathname, search } = location
      onChangePath(`${pathname}${search}`)
    }
  }, [location])

  // This function will be called when Zustand updates the URL.
  // It will update the Zustand store location if it differs from the current store location.
  const urlPersistHandler = (url: string) => {
    // console.log('🚀 ~ UrlQueryContainer.jsx:31 ~ useAfterUrlPersist ~ edscStoreLocation:', edscStoreLocation)
    // console.log('🚀 ~ UrlQueryContainer.jsx:27 ~ useAfterUrlPersist ~ url:', url)

    const [pathname, search = ''] = url.split('?')
    // console.log('🚀 ~ UrlQueryContainer.jsx:37 ~ urlPersistHandler ~ pathname, search:', pathname, search)

    if (location.pathname !== pathname || location.search !== search) {
      // // console.log('calling setLocation')
      // setLocation({
      //   pathname,
      //   search: search ? `?${search}` : ''
      // })
      setTimeout(() => {
        navigate(url, { replace: true })
      }, 0)
    }
  }

  // Listen for URL persist events to update the Zustand store location when Zustand updates the URL
  useEffect(() => {
    eventEmitter.on('url.persist', urlPersistHandler)

    return () => {
      eventEmitter.off('url.persist', urlPersistHandler)
    }
  }, [location])

  return null
}

export default connect(null, mapDispatchToProps)(LocationUpdater)
