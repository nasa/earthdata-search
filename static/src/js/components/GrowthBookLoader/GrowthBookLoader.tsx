import React, { useEffect } from 'react'
import { useFeatureIsOn } from '@growthbook/growthbook-react'

import useEdscStore from '../../zustand/useEdscStore'

interface GrowthBookLoaderProps {
  children: React.ReactNode
}

const GrowthBookLoader = ({ children }: GrowthBookLoaderProps) => {
  const setFeatureFlags = useEdscStore((state) => state.growthbook.setFeatureFlags)

  const nlpSearchValue = useFeatureIsOn('nlpSearch')

  // On initial load, set a user id and session id for GrowthBook tracking.
  useEffect(() => {
    const gbUserId = window.localStorage.getItem('gbUserId')
    if (!gbUserId) {
      const newGbUserId = crypto.randomUUID()
      window.localStorage.setItem('gbUserId', newGbUserId)
    }

    const gbSessionId = window.sessionStorage.getItem('gbSessionId')
    if (!gbSessionId) {
      const newGbSessionId = crypto.randomUUID()
      window.sessionStorage.setItem('gbSessionId', newGbSessionId)
    }
  }, [])

  useEffect(() => {
    setFeatureFlags('nlpSearch', nlpSearchValue)
  }, [nlpSearchValue])

  return children
}

export default GrowthBookLoader
