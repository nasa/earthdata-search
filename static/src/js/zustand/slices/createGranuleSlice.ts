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
import { getFocusedGranule, getGranuleId } from '../selectors/granule'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getFocusedCollectionMetadata } from '../selectors/collection'

import routerHelper, { type Router } from '../../router/router'

const createGranuleSlice: ImmerStateCreator<GranuleSlice> = (set, get) => ({
  granule: {
    granuleId: null,
    granuleMetadata: {},

    getGranuleMetadata: async () => {
      const {
        dispatch: reduxDispatch,
        getState: reduxGetState
      } = configureStore()
      const reduxState = reduxGetState()

      const {
        authToken
      } = reduxState

      const currentState = get()
      const earthdataEnvironment = getEarthdataEnvironment(currentState)
      const granuleId = getGranuleId(currentState)
      const collectionMetadata = getFocusedCollectionMetadata(currentState)
      const focusedGranuleMetadata = getFocusedGranule(currentState)

      // If there is no granuleId to fetch, return
      if (!granuleId) return

      // If this is an opensearch granule, we've already retrieved everything we can from the search
      const { isOpenSearch = false } = collectionMetadata
      if (isOpenSearch) return

      // If we already have the metadata for the focusedGranule, don't fetch it again
      const { hasAllMetadata = false } = focusedGranuleMetadata
      if (hasAllMetadata) return

      const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

      try {
        const response = await graphQlRequestObject.search(GET_GRANULE, {
          params: {
            conceptId: granuleId
          }
        })

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

          const granuleMetadata = {
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
          }

          // Update metadata in the store
          set((state) => {
            state.granule.granuleMetadata[conceptId] = granuleMetadata
          })
        } else {
          // If no data was returned, clear the focused granule and redirect the user back to the search page
          set((state) => {
            state.granule.granuleId = null
          })

          const { location } = routerHelper.router?.state || {} as Router['state']
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

        currentState.errors.handleError({
          error,
          action: 'getGranuleMetadata',
          resource: 'granule',
          requestObject: graphQlRequestObject,
          showAlertButton: true,
          title: 'Something went wrong fetching granule metadata'
        })
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
