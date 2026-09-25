import { set as lodashSet } from 'lodash-es'

import type {
  GrowthBookSlice,
  HomeSearchMode,
  ImmerStateCreator
} from '../types'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { localStorageKeys } from '../../constants/localStorageKeys'
import logEvent from '../../util/metrics/experiments/logEvent'
import { sessionStorageKeys } from '../../constants/sessionStorageKeys'

// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'
import { getSitePreferences } from '../selectors/user'

// Default the value to the config value, but allow it to be overridden by the feature flag
const { nlpSearch } = getApplicationConfig()

const createGrowthBookSlice: ImmerStateCreator<GrowthBookSlice> = (set, get) => ({
  growthbook: {
    featureFlags: {
      nlpSearch: {
        featureFlagValue: nlpSearch && nlpSearch === 'true',
        userSelectedValue: localStorage.getItem(localStorageKeys.homeSearchMode) as HomeSearchMode ?? 'default'
      }
    },
    setFeatureFlagValue: (keyPath, value) => {
      set((state) => {
        lodashSet(state.growthbook.featureFlags, keyPath, value)
      })
    },
    setNlpSearchUserSelection: (value) => {
      set((state) => {
        state.growthbook.featureFlags.nlpSearch.userSelectedValue = value
      })

      // Set the value in localStorage
      window.localStorage.setItem(localStorageKeys.homeSearchMode, value.toString())

      const sitePreferences = getSitePreferences(get())
      const { homeSearchMode: preferencesSearchMode } = sitePreferences

      // Show a toast notification if the user has not previously seen it and the preferences
      // search mode is set to default.
      if (
        preferencesSearchMode === 'default'
        && sessionStorage.getItem(sessionStorageKeys.dontShowNlpPopup) !== 'true'
      ) {
        sessionStorage.setItem(sessionStorageKeys.dontShowNlpPopup, 'true')

        addToast('You can set your preferred search method in your User Preferences', {
          appearance: 'info',
          autoDismiss: true
        })
      }

      // Log the user selection change to GrowthBook
      logEvent({
        eventData: value.toString(),
        eventType: 'user_selection_change'
      })
    }
  }
})

export default createGrowthBookSlice
