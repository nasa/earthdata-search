import {
  CMRFacetsParams,
  FacetKeys,
  FacetParamsSlice,
  ImmerStateCreator
} from '../types'

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
            ...(state.facetParams.cmrFacets[facetType] as CMRFacetsParams[FacetKeys][] || []),
            facetValue
          ]
        }
      })
    },
    applyViewAllFacets: () => {
      const zustandState = get()
      const {
        facetParams,
        facets,
        ui
      } = zustandState

      // Close the view all facets modal
      ui.modals.setOpenModal(null)
      facets.viewAllFacets.resetState()

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

      // Reset collection pageNum to 1 when facets are changing
      get().query.changeQuery({
        collection: {
          pageNum: 1
        }
      })
    },
    setCmrFacets: (cmrFacets) => {
      set((state) => {
        state.facetParams.cmrFacets = cmrFacets
      })

      // Reset collection pageNum to 1 when facets are changing
      get().query.changeQuery({
        collection: {
          pageNum: 1
        }
      })
    },
    setViewAllFacets: (viewAllFacets, category) => {
      set((state) => {
        state.facetParams.viewAllFacets = {
          ...state.facetParams.viewAllFacets,
          ...viewAllFacets
        }
      })

      get().facets.viewAllFacets.getViewAllFacets(category)
    },
    triggerViewAllFacets: (category) => {
      // Copy any existing cmrFacets to viewAllFacets
      // This is used to populate the viewAllFacets modal with the current facets
      const { cmrFacets } = get().facetParams
      set((state) => {
        state.facetParams.viewAllFacets = cmrFacets
      })

      get().facets.viewAllFacets.getViewAllFacets(category)
    }
  }
})

export default createFacetParamsSlice
