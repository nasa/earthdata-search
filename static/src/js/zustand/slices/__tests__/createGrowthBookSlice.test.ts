import { localStorageKeys } from '../../../constants/localStorageKeys'
import { sessionStorageKeys } from '../../../constants/sessionStorageKeys'
import logEvent from '../../../util/metrics/experiments/logEvent'
import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import addToast from '../../../util/addToast'

vi.mock('../../../util/metrics/experiments/logEvent', () => ({
  default: vi.fn()
}))

vi.mock('../../../util/addToast', () => ({
  default: vi.fn()
}))

describe('createGrowthBookSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { growthbook } = zustandState

    expect(growthbook).toEqual({
      featureFlags: {
        nlpSearch: {
          featureFlagValue: true,
          userSelectedValue: 'default'
        }
      },
      setFeatureFlagValue: expect.any(Function),
      setNlpSearchUserSelection: expect.any(Function)
    })
  })

  describe('setFeatureFlagValue', () => {
    test('updates featureFlags', () => {
      const zustandState = useEdscStore.getState()
      const { growthbook } = zustandState
      const { setFeatureFlagValue } = growthbook
      setFeatureFlagValue('nlpSearch.featureFlagValue', true)

      const updatedState = useEdscStore.getState()
      const { growthbook: updatedGrowthbook } = updatedState
      expect(updatedGrowthbook.featureFlags.nlpSearch.featureFlagValue).toBe(true)
    })
  })

  describe('setNlpSearchUserSelection', () => {
    test('updates userSelectedValue', () => {
      const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
      const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')

      const zustandState = useEdscStore.getState()
      const { growthbook } = zustandState
      const { setNlpSearchUserSelection } = growthbook
      setNlpSearchUserSelection('nlp')

      const updatedState = useEdscStore.getState()
      const { growthbook: updatedGrowthbook } = updatedState
      expect(updatedGrowthbook.featureFlags.nlpSearch.userSelectedValue).toEqual('nlp')

      expect(logEvent).toHaveBeenCalledTimes(1)
      expect(logEvent).toHaveBeenCalledWith({
        eventData: 'nlp',
        eventType: 'user_selection_change'
      })

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('You can set your preferred search method in your User Preferences', {
        appearance: 'info',
        autoDismiss: true
      })

      expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith(sessionStorageKeys.dontShowNlpPopup)

      expect(localStorageSetItemSpy).toHaveBeenCalledTimes(2)
      expect(localStorageSetItemSpy).toHaveBeenNthCalledWith(1, localStorageKeys.homeSearchMode, 'nlp')
      expect(localStorageSetItemSpy).toHaveBeenNthCalledWith(2, sessionStorageKeys.dontShowNlpPopup, 'true')
    })

    describe('when the user has previously seen the NLP popup', () => {
      test('does not show the toast', () => {
        const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true')
        const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')

        const zustandState = useEdscStore.getState()
        const { growthbook } = zustandState
        const { setNlpSearchUserSelection } = growthbook
        setNlpSearchUserSelection('nlp')

        expect(addToast).toHaveBeenCalledTimes(0)

        expect(localStorageGetItemSpy).toHaveBeenCalledTimes(1)
        expect(localStorageGetItemSpy).toHaveBeenCalledWith(sessionStorageKeys.dontShowNlpPopup)

        expect(localStorageSetItemSpy).toHaveBeenCalledTimes(1)
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(localStorageKeys.homeSearchMode, 'nlp')
      })
    })

    describe('when the user has set homeSearchMode in their preferences', () => {
      test('does not show the toast', () => {
        const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
        const localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem')

        useEdscStore.setState((state) => {
          state.user.sitePreferences.homeSearchMode = 'nlp'
        })

        const zustandState = useEdscStore.getState()
        const { growthbook } = zustandState
        const { setNlpSearchUserSelection } = growthbook
        setNlpSearchUserSelection('nlp')

        expect(localStorageGetItemSpy).toHaveBeenCalledTimes(0)

        expect(localStorageSetItemSpy).toHaveBeenCalledTimes(1)
        expect(localStorageSetItemSpy).toHaveBeenCalledWith(localStorageKeys.homeSearchMode, 'nlp')
      })
    })
  })
})
