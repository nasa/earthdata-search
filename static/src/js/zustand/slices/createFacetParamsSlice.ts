import {
  FacetKeys,
  FacetParamsSlice,
  ImmerStateCreator,
  ScienceKeywordFacet
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
            // TODO why does this work with ScienceKeywordFacet[]?
            ...(state.facetParams.cmrFacets[facetType] as ScienceKeywordFacet[] || []),
            facetValue
          ]
        }
      })
    },
    applyViewAllFacets: () => {
      const { setCmrFacets, viewAllFacets } = get().facetParams

      setCmrFacets(viewAllFacets)

      const {
        dispatch: reduxDispatch
      } = configureStore()

      reduxDispatch(actions.toggleFacetsModal(false))
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
      reduxDispatch(actions.updateCollectionQuery({ pageNum: 1 }))

      // Fetch collections with the updated feature facets
      reduxDispatch(actions.getCollections())

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
      reduxDispatch(actions.updateCollectionQuery({ pageNum: 1 }))

      // Fetch collections with the updated feature facets
      reduxDispatch(actions.getCollections())

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
