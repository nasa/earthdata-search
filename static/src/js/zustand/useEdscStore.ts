import { create } from 'zustand'
import {
  createJSONStorage,
  devtools,
  persist
} from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { merge } from 'lodash-es'

import { EdscStore } from './types'

import createEarthdataDownloadRedirectSlice from './slices/createEarthdataDownloadRedirectSlice'
import createHomeSlice from './slices/createHomeSlice'
import createMapSlice from './slices/createMapSlice'
import createShapefileSlice from './slices/createShapefileSlice'
import createTimelineSlice from './slices/createTimelineSlice'
import createUiSlice from './slices/createUiSlice'
import createLocationSlice from './slices/createLocationSlice'
import createReduxUpdatedSlice from './slices/createReduxUpdatedSlice'

// @ts-expect-error Types are not defined for this module
import { decodeUrlParams, encodeUrlQuery } from '../util/url/url'

// @ts-expect-error Types are not defined for this module
import configureStore from '../store/configureStore'

// @ts-expect-error Types are not defined for this module
import { getCollectionsMetadata } from '../selectors/collectionMetadata'
// @ts-expect-error Types are not defined for this module
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
// @ts-expect-error Types are not defined for this module
import { getFocusedCollectionId } from '../selectors/focusedCollection'
// @ts-expect-error Types are not defined for this module
import { getFocusedGranuleId } from '../selectors/focusedGranule'
// @ts-expect-error Types are not defined for this module
import { getMapPreferences, getCollectionSortKeyParameter } from '../selectors/preferences'
import { eventEmitter } from '../events/events'
import ProjectRequest from '../util/request/projectRequest'

// @ts-expect-error Types are not defined for this module
import actions from '../actions'

// @ts-expect-error Types are not defined for this module
import { mapStateToProps } from '../containers/UrlQueryContainer/UrlQueryContainer'
// @ts-expect-error Don't want to define types for all of Redux
// const reduxStateToEncode = (state) => ({
//   advancedSearch: state.advancedSearch,
//   autocompleteSelected: state.autocomplete.selected,
//   boundingBoxSearch: state.query.collection.spatial.boundingBox,
//   circleSearch: state.query.collection.spatial.circle,
//   collectionsMetadata: getCollectionsMetadata(state),
//   earthdataEnvironment: getEarthdataEnvironment(state),
//   featureFacets: state.facetsParams.feature,
//   focusedCollection: getFocusedCollectionId(state),
//   focusedGranule: getFocusedGranuleId(state),
//   granuleDataFormatFacets: state.facetsParams.cmr.granule_data_format_h,
//   hasGranulesOrCwic: state.query.collection.hasGranulesOrCwic,
//   horizontalDataResolutionRangeFacets: state.facetsParams.cmr.horizontal_data_resolution_range,
//   latency: state.facetsParams.cmr.latency,
//   instrumentFacets: state.facetsParams.cmr.instrument_h,
//   keywordSearch: state.query.collection.keyword,
//   lineSearch: state.query.collection.spatial.line,
//   mapPreferences: getMapPreferences(state),
//   onlyEosdisCollections: state.query.collection.onlyEosdisCollections,
//   organizationFacets: state.facetsParams.cmr.data_center_h,
//   overrideTemporalSearch: state.query.collection.overrideTemporal,
//   platformFacets: state.facetsParams.cmr.platforms_h,
//   portalId: state.portal.portalId,
//   pointSearch: state.query.collection.spatial.point,
//   polygonSearch: state.query.collection.spatial.polygon,
//   processingLevelFacets: state.facetsParams.cmr.processing_level_id_h,
//   project: state.project,
//   projectFacets: state.facetsParams.cmr.project_h,
//   query: state.query,
//   scienceKeywordFacets: state.facetsParams.cmr.science_keywords_h,
//   paramCollectionSortKey: getCollectionSortKeyParameter(state),
//   tagKey: state.query.collection.tagKey,
//   temporalSearch: state.query.collection.temporal,
//   twoDCoordinateSystemNameFacets: state.facetsParams.cmr.two_d_coordinate_system_name,
//   savedProject: state.savedProject
// })

let previousSearch = ''
const decodeValues = (encodedValues: string) => {
  // console.log('🚀 ~ EdscStore.tsx:37 ~ decodeValues ~ encodedValues:', encodedValues)
  const decodedValues = decodeUrlParams(encodedValues)
  // console.log('🚀 ~ EdscStore.tsx:36 ~ decodeValues ~ decodedValues:', decodedValues)

  const values: Partial<EdscStore> = {
    shapefile: decodedValues.shapefile || {},
    map: {
      mapView: decodedValues.mapView
    } as EdscStore['map'],
    timeline: {
      query: decodedValues.timelineQuery
    } as EdscStore['timeline'],
    reduxUpdated: {
      lastUpdated: 0
    } as EdscStore['reduxUpdated']
  }
  // console.log('🚀 ~ EdscStore.tsx:46 ~ decodeValues ~ values:', values)

  return values
}

const urlStorage = {
  getItem: (key: string) => {
    console.log('🚀 ~ EdscStore.tsx:27 ~ key:', key)

    // Decode the URL search parameters to get the Zustand values
    return JSON.stringify({
      state: {
        ...decodeValues(window.location.search),
        // location: {
        //   location: window.location
        // }
      }
    })
  },
  setItem: async (key: string, value: string) => {
    const { location } = window
    const { pathname, search } = location
    // console.log('🚀 ~ useEdscStore.ts:126 ~ setItem: ~ previousSearch:', previousSearch)
    // console.log('🚀 ~ useEdscStore.ts:123 ~ setItem: ~ search:', search)

    // if (previousSearch !== search) return


    // console.log('🚀 ~ EdscStore.tsx:32 ~ key:', key)
    // console.log('🚀 ~ EdscStore.tsx:32 ~ value:', value)
    const { NODE_ENV } = process.env
    let reduxEncodedState = {}

    // Get the current Redux state
    // Using Redux state is temporary while we move all the state to Zustand.
    // We don't need to use this for tests, so we can skip it in test environments.
    // After all of the Redux state that is used for the URL is moved to Zustand, this can be removed.
    let authToken = ''
    let earthdataEnvironment = ''
    let reduxDispatch = (fn: () => void) => fn

    if (NODE_ENV !== 'test') {
      const reduxStore = configureStore()
      const { getState, dispatch } = reduxStore
      reduxDispatch = dispatch

      const reduxState = getState()

      reduxEncodedState = mapStateToProps(reduxState);

      ({ authToken, earthdataEnvironment } = reduxState)
    }
    // console.log('🚀 ~ useEdscStore.ts:65 ~ reduxState:', reduxState)

    // Combine the Redux state with the Zustand values to encode
    const valuesToEncode = {
      ...reduxEncodedState,
      ...JSON.parse(value).state
    }

    // console.log('🚀 ~ useEdscStore.ts:80 ~ window.location.pathname:', window.location.pathname)
    // Encode the values to a URL query string
    let encodedValues = encodeUrlQuery(valuesToEncode)
    console.log('🚀 ~ useEdscStore.ts:152 ~ setItem: ~ valuesToEncode:', valuesToEncode)

    const { savedProject = {} } = valuesToEncode
    console.log('🚀 ~ useEdscStore.ts:155 ~ setItem: ~ savedProject:', savedProject)
    const { projectId, name, path } = savedProject

    if (projectId || encodedValues.length > 2000) {
      console.log('🚀 ~ useEdscStore.ts:158 ~ setItem: ~ path:', path)
      console.log('🚀 ~ useEdscStore.ts:162 ~ setItem: ~ encodedValues:', encodedValues)
      console.log('🚀 ~ useEdscStore.ts:163 ~ setItem: ~ path !== encodedValues:', path !== encodedValues)
      if (path !== encodedValues) {
        const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

        const projectResponse = requestObject.save({
          authToken,
          name,
          path: encodedValues,
          projectId
        })
          .then((response) => {
            const { data } = response
            const {
              project_id: newProjectId,
              path: projectPath
            } = data

            encodedValues = `${projectPath.split('?')[0]}?projectId=${newProjectId}`

            if (projectId !== newProjectId) {
              // navigate(newOptions, { replace: true })
              window.history.replaceState({}, '', encodedValues)
            }

            reduxDispatch(actions.updateSavedProject({
              path: projectPath,
              name,
              projectId: newProjectId
            }))
          })
          .catch((error) => {
            dispatch(actions.handleError({
              error,
              action: 'changeUrl',
              resource: 'project',
              verb: 'updating',
              requestObject
            }))
          })

        return projectResponse
      }
    } else {
      const newUrl = `${window.location.pathname}${encodedValues}`

      const currentUrl = `${pathname}${search}`

      if (currentUrl !== newUrl) {
        // Update the URL without reloading the page
        console.log('🚀 ~ useEdscStore.ts:142 ~ newUrl:', newUrl)
        // window.history.replaceState({}, '', newUrl)

        eventEmitter.emit('url.persist', newUrl)
      }
    }
  },
  removeItem: (key: string) => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.delete(key)
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams.toString()}`)
  }
}

const useEdscStore = create<EdscStore>()(
  immer(
    devtools(
      persist<EdscStore>(
        (...args) => ({
          ...createEarthdataDownloadRedirectSlice(...args),
          ...createHomeSlice(...args),
          ...createLocationSlice(...args),
          ...createMapSlice(...args),
          ...createShapefileSlice(...args),
          ...createTimelineSlice(...args),
          ...createUiSlice(...args),
          ...createReduxUpdatedSlice(...args)
        }),
        {
          name: 'edsc-store',
          storage: createJSONStorage(() => urlStorage),
          // @ts-expect-error Don't know what this means
          partialize: (state) => ({
            mapView: state.map.mapView,
            selectedFeatures: state.shapefile.selectedFeatures,
            shapefileId: state.shapefile.shapefileId,
            timelineQuery: state.timeline.query,
            lastUpdated: state.reduxUpdated.lastUpdated
          }),
          merge,
          version: 1
        }
      ),
      {
        name: 'edsc-store'
      }
    )
  )
)

export default useEdscStore
