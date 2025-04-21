export type HomeSlice = {
  home: {
    startDrawing: boolean | string
    setStartDrawing: (startDrawing: boolean | string) => void
    openKeywordFacet: boolean
    setOpenKeywordFacet: (openKeywordFacet: boolean) => void
  }
}

export type MapSlice = {
  map: {
    showMbr: boolean
    setShowMbr: (showMbr: boolean) => void
  }
}

export type UiSlice = {
  ui: {
    panels: {
      panelsWidth: number
      setPanelsWidth: (panelsWidth: number) => void
    }
    tour: {
      runTour: boolean
      setRunTour: (runTour: boolean) => void
      onSearchLoaded: () => void
    }
  }
}

export type EdscStore =
  HomeSlice
  & MapSlice
  & UiSlice
