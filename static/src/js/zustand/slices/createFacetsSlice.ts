import { MODAL_NAMES } from '../../constants/modalNames'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { setOpenModalFunction } from '../selectors/ui'
import { getEdlToken } from '../selectors/user'

import CollectionRequest from '../../util/request/collectionRequest'
// @ts-expect-error This file does not have types
import { buildCollectionSearchParams, prepareCollectionParams } from '../../util/collections'
// @ts-expect-error This file does not have types
import { countSelectedFacets, getStartingLetters } from '../../util/facets'

import type {
  Facet,
  Facets,
  FacetsSlice,
  ImmerStateCreator
} from '../types'

const createFacetsSlice: ImmerStateCreator<FacetsSlice> = (set, get) => ({
  facets: {
    facets: {
      allIds: [],
      byId: {},
      isLoaded: false,
      isLoading: false,
      updateFacets: (facets) => {
        const allIds: string[] = []
        const byId: Facets = {}

        facets.forEach((facetCategory) => {
          const { title } = facetCategory
          allIds.push(title)
          byId[title] = facetCategory
          byId[title].totalSelected = countSelectedFacets(facetCategory)
        })

        set((state) => {
          state.facets.facets.allIds = allIds
          state.facets.facets.byId = byId
          state.facets.facets.isLoaded = true
          state.facets.facets.isLoading = false
        })
      }
    },
    viewAllFacets: {
      allIds: [],
      byId: {},
      collectionCount: null,
      isLoaded: false,
      isLoading: false,
      selectedCategory: null,
      getViewAllFacets: async (category) => {
        set((state) => {
          state.facets.viewAllFacets.selectedCategory = category
          state.facets.viewAllFacets.isLoaded = false
          state.facets.viewAllFacets.isLoading = true
        })

        const zustandState = get()

        const edlToken = getEdlToken(zustandState)
        const earthdataEnvironment = getEarthdataEnvironment(zustandState)
        const setOpenModal = setOpenModalFunction(zustandState)

        setOpenModal(MODAL_NAMES.VIEW_ALL_FACETS)

        const collectionParams = prepareCollectionParams()

        const requestObject = new CollectionRequest(edlToken, earthdataEnvironment)

        requestObject.search(buildCollectionSearchParams(collectionParams))
          .then((searchResponse) => {
            const facets = searchResponse.data.feed.facets.children || []
            const count = parseInt(searchResponse.headers['cmr-hits'], 10)

            const allIds: string[] = []
            const byId: Facets = {};

            (facets as Facet[]).forEach((facetCategory) => {
              // Only add the category weve selected to the state
              if (facetCategory.title !== category) return

              byId[facetCategory.title] = facetCategory
              byId[facetCategory.title].totalSelected = countSelectedFacets(facetCategory)
              byId[facetCategory.title].startingLetters = getStartingLetters(facetCategory.children)
              allIds.push(facetCategory.title)
            })

            set((state) => {
              state.facets.viewAllFacets.isLoaded = true
              state.facets.viewAllFacets.isLoading = false

              state.facets.viewAllFacets.allIds = allIds
              state.facets.viewAllFacets.byId = byId
              state.facets.viewAllFacets.collectionCount = count
              state.facets.viewAllFacets.selectedCategory = category
            })
          })
          .catch((error: Error) => {
            set((state) => {
              state.facets.viewAllFacets.isLoaded = false
              state.facets.viewAllFacets.isLoading = false
            })

            zustandState.errors.handleError({
              error,
              action: 'getViewAllFacets',
              resource: 'facets',
              requestObject,
              showAlertButton: true,
              title: 'Something went wrong fetching all filter options'
            })
          })
      },
      resetState: () => {
        set((state) => {
          state.facets.viewAllFacets.allIds = []
          state.facets.viewAllFacets.byId = {}
          state.facets.viewAllFacets.collectionCount = null
          state.facets.viewAllFacets.isLoaded = false
          state.facets.viewAllFacets.isLoading = false
        })
      }
    }
  }
})

export default createFacetsSlice
