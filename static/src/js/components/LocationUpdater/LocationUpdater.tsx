import { useEffect } from 'react'

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

const LocationUpdater = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  console.log('🚀 ~ LocationUpdater.tsx:18 ~ LocationUpdater ~ navigationType:', navigationType)

  const {
    setLocation,
    setNavigate
  } = useEdscStore((state) => ({
    setLocation: state.location.setLocation,
    setNavigate: state.location.setNavigate
  }))

  useEffect(() => {
    setNavigate(navigate)
  }, [])

  useEffect(() => {
    setLocation(location as unknown as Location)

    virtualPageview(navigationType)
  }, [location])

  return null
}

export default LocationUpdater
