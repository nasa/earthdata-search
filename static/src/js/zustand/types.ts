import { StateCreator } from 'zustand'
import { ProjectionCode, TimelineIntervals } from '../types/sharedTypes'

export type HomeSlice = {
  /** The Home Slice of the store */
  home: {
    /** When redirecting from the Home page, startDrawing is set if the user selected a spatial type to start drawing. */
    startDrawing: boolean | string
    /** Function to set the startDrawing value */
    setStartDrawing: (startDrawing: boolean | string) => void
    /** Flag if the Keyword facet group should be opened */
    openKeywordFacet: boolean
    /** Function to set the openKeywordFacet value */
    setOpenKeywordFacet: (openKeywordFacet: boolean) => void
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
  HomeSlice
  & MapSlice
  & TimelineSlice
  & UiSlice

export type ImmerStateCreator<T> = StateCreator<EdscStore, [['zustand/immer', never], never], [], T>
