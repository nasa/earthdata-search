import React, { useEffect } from 'react'
import { GrowthBook, useFeatureIsOn } from '@growthbook/growthbook-react'

import useEdscStore from '../../zustand/useEdscStore'
import { localStorageKeys } from '../../constants/localStorageKeys'
import { sessionStorageKeys } from '../../constants/sessionStorageKeys'

interface GrowthBookLoaderProps {
  /** The GrowthBook instance used for feature flag evaluation */
  growthbook: GrowthBook
  /** The child components that will have access to the GrowthBook context */
  children: React.ReactNode
}

const GrowthBookLoader = ({
  growthbook,
  children
}: GrowthBookLoaderProps) => {
  const setNlpSearchFeatureFlag = useEdscStore((state) => state.growthbook.setNlpSearchFeatureFlag)

  const nlpSearchValue = useFeatureIsOn('nlpSearch')

  // On initial load, set a user id and session id for GrowthBook tracking.
  useEffect(() => {
    const gbUserId = window.localStorage.getItem(localStorageKeys.gbUserId)
    if (!gbUserId) {
      const newGbUserId = crypto.randomUUID()
      window.localStorage.setItem(localStorageKeys.gbUserId, newGbUserId)
    }

    // Set the GrowthBook user attributes with the user id.
    growthbook.setAttributes({
      id: gbUserId || window.localStorage.getItem(localStorageKeys.gbUserId)
    })

    const gbSessionId = window.sessionStorage.getItem(sessionStorageKeys.gbSessionId)
    if (!gbSessionId) {
      const newGbSessionId = crypto.randomUUID()
      window.sessionStorage.setItem(sessionStorageKeys.gbSessionId, newGbSessionId)
    }
  }, [])

  useEffect(() => {
    setNlpSearchFeatureFlag(nlpSearchValue)
  }, [nlpSearchValue])

  return children
}

export default GrowthBookLoader
