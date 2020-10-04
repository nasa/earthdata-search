import {
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
  TOGGLE_ABOUT_CWIC_MODAL,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  TOGGLE_KEYBOARD_SHORTCUTS_MODAL
} from '../constants/actionTypes'

const initialState = {
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
  },
  spatialPolygonWarning: {
    isDisplayed: false
  },
  keyboardShortcutsModal: {
    isOpen: false
  }
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case TOGGLE_SPATIAL_POLYGON_WARNING: {
      return {
        ...state,
        spatialPolygonWarning: {
          isDisplayed: action.payload
        }
      }
    }
    case TOGGLE_KEYBOARD_SHORTCUTS_MODAL: {
      return {
        ...state,
        keyboardShortcutsModal: {
          isOpen: action.payload
        }
      }
    }
    default:
      return state
  }
}

export default uiReducer
