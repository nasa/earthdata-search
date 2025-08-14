import type { GranuleSlice, ImmerStateCreator } from '../types'

// @ts-expect-error There are no types for this file
import GraphQlRequest from '../../util/request/graphQlRequest'

// @ts-expect-error There are no types for this file
import { createEcho10MetadataUrls } from '../../util/granules'

// @ts-expect-error There are no types for this file
import configureStore from '../../store/configureStore'

// @ts-expect-error There are no types for this file
import actions from '../../actions'

import GET_GRANULE from '../../operations/queries/getGranule'
import { getGranuleId } from '../selectors/granule'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

const createGranuleSlice: ImmerStateCreator<GranuleSlice> = (set, get) => ({
  granule: {
    granuleId: null,

    getGranuleMetadata: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken,
        metadata,
        router
      } = reduxState

      const currentState = get()
      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const granuleId = getGranuleId(currentState)

      // Retrieve data from Redux using selectors
      // TODO EDSC-4516, this should be pulled from a selector, but Redux selectors don't see zustand state changes
      const { granules: granulesMetadata = {} } = metadata
      const { [granuleId]: focusedGranuleMetadata = {} } = granulesMetadata

      // Use the `hasAllMetadata` flag to determine if we've requested previously
      // requested the focused collections metadata from graphql
      const {
        hasAllMetadata = false,
        isOpenSearch = false
      } = focusedGranuleMetadata

      // If this is an opensearch granule, we've already retrieved everything we can from the search
      if (isOpenSearch) return

      // If we already have the metadata for the focusedGranule, don't fetch it again
      if (hasAllMetadata) return

      const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

      try {
        const response = await graphQlRequestObject.search(GET_GRANULE, {
          params: {
            conceptId: granuleId
          }
        })

        const payload = []

        const {
          data: responseData
        } = response

        const { data } = responseData
        const { granule } = data

        if (granule) {
          const {
            collectionConceptId,
            conceptId,
            dataCenter,
            dataGranule,
            dayNightFlag,
            granuleSize,
            granuleUr,
            measuredParameters,
            onlineAccessFlag,
            originalFormat,
            providerDates,
            relatedUrls,
            spatialExtent,
            temporalExtent,
            timeEnd,
            timeStart,
            title
          } = granule

          payload.push({
            collectionConceptId,
            conceptId,
            dataCenter,
            dataGranule,
            dayNightFlag,
            granuleSize,
            granuleUr,
            hasAllMetadata: true,
            id: conceptId,
            measuredParameters,
            metadataUrls: createEcho10MetadataUrls(granuleId, earthdataEnvironment),
            onlineAccessFlag,
            originalFormat,
            providerDates,
            relatedUrls,
            spatialExtent,
            temporalExtent,
            timeEnd,
            timeStart,
            title
          })

          // Update metadata in the store
          reduxDispatch(actions.updateGranuleMetadata(payload))
        } else {
          // If no data was returned, clear the focused granule and redirect the user back to the search page
          set((state) => {
            state.granule.granuleId = null
          })

          const { location } = router
          const { search } = location

          reduxDispatch(actions.changeUrl({
            pathname: '/search',
            search
          }))
        }
      } catch (error) {
        set((state) => {
          state.granule.granuleId = null
        })

        reduxDispatch(actions.handleError({
          error,
          action: 'getGranuleMetadata',
          resource: 'granule',
          requestObject: graphQlRequestObject
        }))
      }
    },

    setGranuleId: async (granuleId) => {
      set((state) => {
        state.granule.granuleId = granuleId
      })

      if (granuleId) {
        get().granule.getGranuleMetadata()
      }
    }
  }
})

export default createGranuleSlice
