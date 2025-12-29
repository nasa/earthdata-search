import { merge } from 'lodash-es'

// @ts-expect-error This file doesn't have types
import { buildConfig } from '../portals'

// eslint-disable-next-line import/no-unresolved
import availablePortals from '../../../../../portals/availablePortals.json'

import routerHelper, { type Router } from '../../router/router'

import { MODAL_NAMES } from '../../constants/modalNames'
import { routes } from '../../constants/routes'

import useEdscStore from '../../zustand/useEdscStore'

import { isPath } from '../isPath'
import {
  isSavedProjectsPage,
  urlPathsWithoutUrlParams
// @ts-expect-error This file doesn't have types
} from './url'

import type {
  FacetParamsSlice,
  MapSlice,
  ProjectSlice,
  QuerySlice,
  ShapefileSlice,
  TimelineSlice
} from '../../zustand/types'

export type UpdateStoreParams = {
  /** Facet parameters for CMR Facets */
  cmrFacets: FacetParamsSlice['facetParams']['cmrFacets'],
  /** List of deprecated URL parameters found in the URL */
  deprecatedUrlParams: string[],
  /** Current Earthdata environment */
  earthdataEnvironment: string,
  /** Facet parameters for Feature Facets */
  featureFacets: FacetParamsSlice['facetParams']['featureFacets'],
  /** Focused collection ID */
  focusedCollection: string,
  /** Focused granule ID */
  focusedGranule: string,
  /** Map view state */
  mapView: MapSlice['map']['mapView'],
  /** Current portal ID */
  portalId: string,
  /** Project state */
  project: ProjectSlice['project'],
  /** Query state */
  query: QuerySlice['query'],
  /** Selected region state */
  selectedRegion: QuerySlice['query']['selectedRegion'],
  /** Shapefile state */
  shapefile: ShapefileSlice['shapefile'],
  /** Timeline state */
  timeline: TimelineSlice['timeline']
}

export const updateStore = async ({
  cmrFacets,
  deprecatedUrlParams,
  earthdataEnvironment,
  featureFacets,
  focusedCollection,
  focusedGranule,
  mapView,
  portalId,
  project,
  query,
  selectedRegion,
  shapefile,
  timeline
}: UpdateStoreParams, newPathname?: string) => {
  const { location } = routerHelper.router?.state || {} as Router['state']
  const { pathname } = location

  // Prevent loading from the urls that don't use URL params.
  const loadFromUrl = (
    pathname !== routes.HOME
    && !isPath(pathname, urlPathsWithoutUrlParams)
    && !isSavedProjectsPage(location)
  )

  const portal = portalId
    ? buildConfig((availablePortals as Record<string, unknown>)[portalId])
    : {}

  // If the newPathname is not equal to the current pathname, restore the data from the url
  if (loadFromUrl || (newPathname && newPathname !== pathname)) {
    useEdscStore.setState((zustandState) => {
      // Use merge on the queries to correctly use the initial state as a fallback for `undefined` decoded values
      const mergedQuery = merge({}, zustandState.query, query)

      const modals = { ...zustandState.ui.modals }

      if (deprecatedUrlParams.length > 0) {
        modals.openModal = MODAL_NAMES.DEPRECATED_PARAMETER
        modals.modalData = { deprecatedUrlParams }
      }

      return ({
        ...zustandState,
        earthdataEnvironment: {
          currentEnvironment: earthdataEnvironment
        },
        facetParams: {
          ...zustandState.facetParams,
          featureFacets,
          cmrFacets
        },
        collection: {
          ...zustandState.collection,
          collectionId: focusedCollection
        },
        granule: {
          ...zustandState.granule,
          granuleId: focusedGranule
        },
        map: merge({}, zustandState.map, {
          mapView: merge({}, zustandState.map.mapView, mapView)
        }),
        portal,
        project: merge({}, zustandState.project, project),
        query: {
          ...mergedQuery,
          collection: {
            ...mergedQuery.collection,
            // If `hasGranulesOrCwic` is `undefined` from the decoded values it needs to stay `undefined` in the
            // store, not fallback to the initial state
            hasGranulesOrCwic: query.collection.hasGranulesOrCwic
          },
          selectedRegion: {
            ...mergedQuery.selectedRegion,
            ...selectedRegion
          }
        },
        shapefile: merge({}, zustandState.shapefile, shapefile),
        timeline: merge({}, zustandState.timeline, timeline),
        ui: {
          ...zustandState.ui,
          modals
        }
      })
    })
  } else {
    // We always need to load the portal config
    useEdscStore.setState((zustandState) => ({
      ...zustandState,
      portal
    }))
  }
}
