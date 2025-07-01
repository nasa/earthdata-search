import { StateCreator } from 'zustand'

import {
  PortalConfig,
  ProjectionCode,
  ShapefileFile,
  TimelineIntervals
} from '../types/sharedTypes'

export type EarthdataDownloadRedirectSlice = {
  /** The Earthdata Download Redirect Slice of the store */
  earthdataDownloadRedirect: {
    /** The redirect URL for earthdata download */
    redirectUrl: string
    /** Function to set the redirect URL */
    setRedirectUrl: (redirect: string) => void
  }
}

type FeatureFacets = {
  /** Flag if the facet is available in Earthdata Cloud */
  availableInEarthdataCloud: boolean
  /** Flag if the facet is customizable */
  customizable: boolean
  /** Flag if the facet is a map imagery */
  mapImagery: boolean
}

/** Keys used for CMR Facets */
export type FacetKeys = 'science_keywords_h'
  | 'platforms_h'
  | 'instrument_h'
  | 'data_center_h'
  | 'project_h'
  | 'processing_level_id_h'
  | 'granule_data_format_h'
  | 'two_d_coordinate_system_name'
  | 'horizontal_data_resolution_range'
  | 'latency'

/** The Platform Facet */
type PlatformFacet = {
  basis?: string
  category?: string
  short_name?: string
  sub_category?: string
}

/** The Science Keyword Facet */
export type ScienceKeywordFacet = {
  detailed_variable?: string
  term?: string
  topic?: string
  variable_level_1?: string
  variable_level_2?: string
  variable_level_3?: string
}

/** The CMR Facets */
export type CMRFacets = {
  data_center_h?: string[]
  granule_data_format_h?: string[]
  horizontal_data_resolution_range?: string[]
  instrument_h?: string[]
  latency?: string[]
  platforms_h?: PlatformFacet[]
  processing_level_id_h?: string[]
  project_h?: string[]
  science_keywords_h?: ScienceKeywordFacet[] | ScienceKeywordFacet
  two_d_coordinate_system_name?: string[]
}

/** The View All Facets */
type ViewAllFacets = {
  data_center_h?: string[]
  granule_data_format_h?: string[]
  instrument_h?: string[]
  project_h?: string[]
}

export type FacetParamsSlice = {
  /** The Facets Slice of the store */
  facetParams: {
    /** The feature facets */
    featureFacets: FeatureFacets
    /** The CMR facets */
    cmrFacets: CMRFacets
    /** The view all facets */
    viewAllFacets: ViewAllFacets
    /** Function to add a CMR facet from an autocomplete suggestion */
    addCmrFacetFromAutocomplete: (facet: CMRFacets) => void
    /** Function to apply the viewAllFacets params */
    applyViewAllFacets: () => void
    /** Function to reset the facet params */
    resetFacetParams: () => void
    /** Function to set the feature facets */
    setFeatureFacets: (featureFacets: Partial<FeatureFacets>) => void
    /** Function to set the CMR facets */
    setCmrFacets: (cmrFacets: CMRFacets) => void
    /** Function to set the view all facets */
    setViewAllFacets: (viewAllFacets: ViewAllFacets, category: keyof ViewAllFacets) => void
    /** Function to trigger the View All Facets modal */
    triggerViewAllFacets: (category: string) => void
  }
}

export type HomeSlice = {
  /** The Home Slice of the store */
  home: {
    /** When redirecting from the Home page, startDrawing is set if the user selected a spatial type to start drawing. */
    startDrawing: boolean | string
    /** Function to set the startDrawing value */
    setStartDrawing: (startDrawing: boolean | string) => void
    /** Flag if a facet group should be opened */
    openFacetGroup: string | null
    /** Function to set the setOpenFacetGroup value */
    setOpenFacetGroup: (groupName: string | null) => void
  }
}

export type MapView = {
  /** The base layer of the map */
  base: {
    /** Is the World Imagery base layer applied */
    worldImagery: boolean
    /** Is the True Color base layer applied */
    trueColor: boolean
    /** Is the Land Water Map base layer applied */
    landWaterMap: boolean
  }
  /** The latitude of the map */
  latitude: number
  /** The longitude of the map */
  longitude: number
  /** The overlays of the map */
  overlays: {
    /** Is the borders and roads overlay applied */
    bordersRoads: boolean
    /** Is the coastlines overlay applied */
    coastlines: boolean
    /** Is the place labels overlay applied */
    placeLabels: boolean
  }
  /** The projection of the map */
  projection: ProjectionCode
  /** The rotation of the map */
  rotation: number
  /** The zoom level of the map */
  zoom: number
}

export type MapSlice = {
  /** The Map Slice of the store */
  map: {
    /** The map view */
    mapView: MapView
    /** Function to set the map view */
    setMapView: (mapView: Partial<MapView>) => void
    /** Flag to show the MBR (Minimum Bounding Rectangle) of the applied spatial search */
    showMbr: boolean
    /** Function to set the showMbr value */
    setShowMbr: (showMbr: boolean) => void
  }
}

export type PreferencesState = {
  panelState: string
  collectionListView: string
  granuleListView: string
  collectionSort: string
  granuleSort: string
  mapView: {
    zoom: number
    latitude: number
    baseLayer: string
    longitude: number
    projection: string
    overlayLayers: string[]
    rotation: number
  }
  isSubmitting: boolean
  isSubmitted: boolean
}

export type PreferencesSlice = {
  /** The Preferences Slice of the store */
  preferences: PreferencesState & {
    /** Function to set preferences */
    setPreferences: (preferences: Partial<PreferencesState>) => void
    /** Function to set the submitting state */
    setIsSubmitting: (isSubmitting: boolean) => void
    /** Function to set the submitted state */
    setIsSubmitted: (isSubmitted: boolean) => void
    /** Function to reset preferences to initial state */
    resetPreferences: () => void
    /** Function to set panel state */
    setPanelState: (panelState: string) => void
    /** Function to set collection list view */
    setCollectionListView: (collectionListView: string) => void
    /** Function to set granule list view */
    setGranuleListView: (granuleListView: string) => void
    /** Function to set collection sort preference */
    setCollectionSort: (collectionSort: string) => void
    /** Function to set granule sort preference */
    setGranuleSort: (granuleSort: string) => void
    /** Function to set map view preferences */
    setMapView: (mapView: Partial<PreferencesState['mapView']>) => void
    /** Function to set preferences from JWT token */
    setPreferencesFromJwt: (jwtToken: string) => void
    /** Function to update preferences via API */
    updatePreferences: (data: { formData: PreferencesState }) => Promise<void>
  }
}

export type PortalSlice = {
  /** The Portal Slice of the store */
  portal: PortalConfig
}

type UpdateShapefileProps = {
  /** The shapefile id */
  shapefileId?: string
  /** The shapefile name */
  shapefileName?: string
  /** The shapefile size */
  shapefileSize?: string
  /** The selected features of the shapefile */
  selectedFeatures?: string[]
  /** The shapefile contents */
  file?: ShapefileFile
}

type SaveShapefileProps = {
  /** The user's authToken */
  authToken: string
  /** The shapefile filename */
  filename: string
  /** The shapefile size */
  size: string
  /** The shapefile contents */
  file: ShapefileFile
}

export type ShapefileSlice = {
  /** The Shapefile Slice of the store */
  shapefile: {
    /** Flag to show the shapefile loading */
    isLoading: boolean
    /** Flag to show the shapefile loaded */
    isLoaded: boolean
    /** Flag to show the shapefile errored */
    isErrored: boolean | { message: string }
    /** The shapefile contents */
    file?: ShapefileFile
    /** The selected features of the shapefile */
    selectedFeatures?: string[]
    /** The shapefile id */
    shapefileId?: string
    /** The shapefile name */
    shapefileName?: string
    /** The shapefile size */
    shapefileSize?: string
    /** Function to set the shapefile loading */
    setLoading: (shapefileName?: string) => void
    /** Function to set the shapefile errored */
    setErrored: (message: string) => void
    /** Function to update the shapefile */
    updateShapefile: (data: UpdateShapefileProps) => void
    /** Function to clear the shapefile */
    clearShapefile: () => void
    /** Function to save the shapefile */
    saveShapefile: (data: SaveShapefileProps) => Promise<void>
    /** Function to fetch the shapefile */
    fetchShapefile: (shapefileId: string) => Promise<void>
  }
}

/** The accepted timeline interval values in CMR */
export enum TimelineInterval {
  Decade = 'decade',
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second'
}

type TimelineQuery = {
  /** The center timestamp of the timeline */
  center?: number,
  /** The interval of the timeline */
  interval?: TimelineInterval,
  /** The end date of the timeline */
  endDate?: string,
  /** The start date of the timeline */
  startDate?: string,
  /** The end of the focused timespan */
  end?: number,
  /** The start of the focused timespan */
  start?: number,
}

export type TimelineIntervalData = {
  /** The intervals of the timeline per concept-id */
  [key: string]: TimelineIntervals
}

export type TimelineSlice = {
  /** The Timeline Slice of the store */
  timeline: {
    /** The intervals of the timeline */
    intervals: TimelineIntervalData,
    /** The query of the timeline */
    query: TimelineQuery,
    /** Function to set the query value */
    setQuery: (query: TimelineQuery) => void
    /** Function to get the timeline */
    getTimeline: () => Promise<void>
  }
}

export type UiSlice = {
  /** The UI Slice of the store */
  ui: {
    panels: {
      /** Width of the panels */
      panelsWidth: number
      /** Function to set the panelsWidth value */
      setPanelsWidth: (panelsWidth: number) => void
    }
    tour: {
      /** Flag to show the tour */
      runTour: boolean
      /** Function to set the runTour value */
      setRunTour: (runTour: boolean) => void
      /** Callback function when the Search route is loaded */
      onSearchLoaded: () => void
    }
  }
}

export type EdscStore =
  EarthdataDownloadRedirectSlice
  & FacetParamsSlice
  & HomeSlice
  & MapSlice
  & PortalSlice
  & PreferencesSlice
  & ShapefileSlice
  & TimelineSlice
  & UiSlice

export type ImmerStateCreator<T> = StateCreator<EdscStore, [['zustand/immer', never], never], [], T>
