import {
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_TOGGLE,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  TOGGLE_DRAWING_NEW_LAYER,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SECONDARY_OVERLAY_PANEL,
  TOGGLE_SELECTING_NEW_GRID,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  TOGGLE_TOO_MANY_POINTS_MODAL,
  TOGGLE_CHUNKED_ORDER_MODAL,
  TOGGLE_ABOUT_CWIC_MODAL
} from '../constants/actionTypes'

const initialState = {
  masterOverlayPanel: {
    clickStartHeight: undefined,
    clickStartY: undefined,
    dragging: false,
    height: 0,
    previousHeight: 0,
    isOpen: true
  },
  granuleResultsPanel: {
    sortOrder: '-start_date',
    searchValue: ''
  },
  facetsModal: {
    isOpen: false
  },
  overrideTemporalModal: {
    isOpen: false
  },
  relatedUrlsModal: {
    isOpen: false
  },
  map: {
    drawingNewLayer: false
  },
  grid: {
    selectingNewGrid: false
  },
  secondaryOverlayPanel: {
    isOpen: false
  },
  advancedSearchModal: {
    isOpen: false
  },
  shapefileUploadModal: {
    isOpen: false
  },
  tooManyPointsModal: {
    isOpen: false
  },
  chunkedOrderModal: {
    isOpen: false
  },
  aboutCwicModal: {
    isOpen: false
  }
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case MASTER_OVERLAY_PANEL_DRAG_START: {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          clickStartHeight: action.payload.clickStartHeight,
          clickStartY: action.payload.clickStartY,
          dragging: true
        }
      }
    }
    case MASTER_OVERLAY_PANEL_DRAG_END: {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          clickStartHeight: undefined,
          clickStartY: undefined,
          dragging: false
        }
      }
    }
    case MASTER_OVERLAY_PANEL_UPDATE_RESIZE: {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          height: action.payload,
          previousHeight: action.payload
        }
      }
    }
    case MASTER_OVERLAY_PANEL_TOGGLE: {
      const { isOpen, previousHeight } = state.masterOverlayPanel
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          height: isOpen ? 0 : previousHeight,
          isOpen: !isOpen
        }
      }
    }
    case TOGGLE_VIEW_ALL_FACETS_MODAL: {
      return {
        ...state,
        facetsModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_OVERRIDE_TEMPORAL_MODAL: {
      return {
        ...state,
        overrideTemporalModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_RELATED_URLS_MODAL: {
      return {
        ...state,
        relatedUrlsModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_DRAWING_NEW_LAYER: {
      const { map } = state
      return {
        ...state,
        map: {
          ...map,
          drawingNewLayer: action.payload
        }
      }
    }
    case TOGGLE_SECONDARY_OVERLAY_PANEL: {
      return {
        ...state,
        secondaryOverlayPanel: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_SELECTING_NEW_GRID: {
      const { grid } = state
      return {
        ...state,
        grid: {
          ...grid,
          selectingNewGrid: action.payload
        }
      }
    }
    case TOGGLE_ADVANCED_SEARCH_MODAL: {
      return {
        ...state,
        advancedSearchModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_SHAPEFILE_UPLOAD_MODAL: {
      return {
        ...state,
        shapefileUploadModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_TOO_MANY_POINTS_MODAL: {
      return {
        ...state,
        tooManyPointsModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_CHUNKED_ORDER_MODAL: {
      return {
        ...state,
        chunkedOrderModal: {
          isOpen: action.payload
        }
      }
    }
    case TOGGLE_ABOUT_CWIC_MODAL: {
      return {
        ...state,
        aboutCwicModal: {
          isOpen: action.payload
        }
      }
    }
    default:
      return state
  }
}

export default uiReducer
