import {
  CMRFacets,
  FacetKeys,
  FacetParamsSlice,
  ImmerStateCreator
} from '../types'

// @ts-expect-error: This file does not have types
import configureStore from '../../store/configureStore'

// @ts-expect-error: This file does not have types
import actions from '../../actions'

const initialState = {
  featureFacets: {
    availableInEarthdataCloud: false,
    customizable: false,
    mapImagery: false
  },
  cmrFacets: {},
  viewAllFacets: {}
}

const createFacetParamsSlice: ImmerStateCreator<FacetParamsSlice> = (set, get) => ({
  facetParams: {
    ...initialState,

    resetFacetParams: () => {
      set((state) => {
        state.facetParams = {
          ...state.facetParams,
          ...initialState
        }
      })
    },
    addCmrFacetFromAutocomplete: (facet) => {
      const [facetType] = Object.keys(facet) as FacetKeys[]
      const facetValue = facet[facetType]

      set((state) => {
        state.facetParams.cmrFacets = {
          ...state.facetParams.cmrFacets,
          [facetType]: [
            ...(state.facetParams.cmrFacets[facetType] as CMRFacets[FacetKeys][] || []),
            facetValue
          ]
        }
      })
    },
    applyViewAllFacets: () => {
      const {
        dispatch: reduxDispatch
      } = configureStore()

      const zustandState = get()
      const {
        facetParams,
        ui
      } = zustandState

      const { modals } = ui
      const { setOpenModal } = modals
      setOpenModal(null)
      reduxDispatch(actions.toggleFacetsModal(false))

      const {
        setCmrFacets,
        viewAllFacets
      } = facetParams

      setCmrFacets(viewAllFacets)

      // When sending these to CMR in static/src/js/util/collections.js we are overriding the cmrFacets
      // with the viewAllFacets, so we need to clear the viewAllFacets after applying them
      set((state) => {
        state.facetParams.viewAllFacets = {}
      })
    },
    setFeatureFacets: (featureFacets) => {
      set((state) => {
        state.facetParams.featureFacets = {
          ...state.facetParams.featureFacets,
          ...featureFacets
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()

      // Reset collection pageNum to 1 when facets are changing
      get().query.changeQuery({
        collection: {
          pageNum: 1
        }
      })

      // Clear any subscription disabledFields
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },
    setCmrFacets: (cmrFacets) => {
      set((state) => {
        state.facetParams.cmrFacets = cmrFacets
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()

      // Reset collection pageNum to 1 when facets are changing
      get().query.changeQuery({
        collection: {
          pageNum: 1
        }
      })

      // Clear any subscription disabledFields
      reduxDispatch(actions.removeSubscriptionDisabledFields())
    },
    setViewAllFacets: (viewAllFacets, category) => {
      set((state) => {
        state.facetParams.viewAllFacets = {
          ...state.facetParams.viewAllFacets,
          ...viewAllFacets
        }
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      // Call getViewAllFacets to populate the searchResults.viewAllFacets
      reduxDispatch(actions.getViewAllFacets(category))
    },
    triggerViewAllFacets: (category) => {
      // Copy any existing cmrFacets to viewAllFacets
      // This is used to populate the viewAllFacets modal with the current facets
      const { cmrFacets } = get().facetParams
      set((state) => {
        state.facetParams.viewAllFacets = cmrFacets
      })

      const {
        dispatch: reduxDispatch
      } = configureStore()
      // Call getViewAllFacets to populate the searchResults.viewAllFacets
      reduxDispatch(actions.getViewAllFacets(category))
    }
  }
})

export default createFacetParamsSlice
