import {
  EXPORT_FINISHED,
  EXPORT_STARTED,
  RESTORE_FROM_URL,
  TOGGLE_ABOUT_CSDA_MODAL,
  TOGGLE_ABOUT_CWIC_MODAL,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_CHUNKED_ORDER_MODAL,
  TOGGLE_DEPRECATED_PARAMETER_MODAL,
  TOGGLE_DRAWING_NEW_LAYER,
  TOGGLE_EDIT_SUBSCRIPTION_MODAL,
  TOGGLE_KEYBOARD_SHORTCUTS_MODAL,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SECONDARY_OVERLAY_PANEL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  TOGGLE_TIMELINE,
  TOGGLE_TOO_MANY_POINTS_MODAL,
  TOGGLE_VIEW_ALL_FACETS_MODAL
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
  aboutCSDAModal: {
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
  },
  timeline: {
    isOpen: true
  },
  export: {
    isExportRunning: {
      csv: false,
      json: false
    }
  },
  deprecatedParameterModal: {
    isOpen: false,
    deprecatedUrlParams: []
  },
  editSubscriptionModal: {
    isOpen: false,
    subscriptionConceptId: '',
    type: ''
  }
}

const uiReducer = (state = initialState, action = {}) => {
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
    case TOGGLE_ABOUT_CSDA_MODAL: {
      return {
        ...state,
        aboutCSDAModal: {
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
    case TOGGLE_EDIT_SUBSCRIPTION_MODAL: {
      const { isOpen, subscriptionConceptId, type } = action.payload
      return {
        ...state,
        editSubscriptionModal: {
          isOpen,
          subscriptionConceptId,
          type
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
    case TOGGLE_TIMELINE: {
      return {
        ...state,
        timeline: {
          isOpen: action.payload
        }
      }
    }
    case EXPORT_STARTED: {
      return {
        ...state,
        export: {
          isExportRunning: {
            ...state.export.isExportRunning,
            [action.payload]: true
          }
        }
      }
    }
    case EXPORT_FINISHED: {
      return {
        ...state,
        export: {
          isExportRunning: {
            ...state.export.isExportRunning,
            [action.payload]: false
          }
        }
      }
    }
    case TOGGLE_DEPRECATED_PARAMETER_MODAL: {
      const { payload: displayModal } = action
      const { deprecatedParameterModal } = state
      let { deprecatedUrlParams } = deprecatedParameterModal

      // If the modal is closing, reset the deprecated url params
      if (!displayModal) deprecatedUrlParams = []

      return {
        ...state,
        deprecatedParameterModal: {
          ...deprecatedParameterModal,
          deprecatedUrlParams,
          isOpen: action.payload
        }
      }
    }
    case RESTORE_FROM_URL: {
      const { payload } = action
      const { deprecatedUrlParams } = payload
      const { deprecatedParameterModal } = state

      if (deprecatedUrlParams.length === 0) return state

      // If any deprecated URL params are defined, display the modal
      return {
        ...state,
        deprecatedParameterModal: {
          ...deprecatedParameterModal,
          deprecatedUrlParams,
          isOpen: true
        }
      }
    }
    default:
      return state
  }
}

export default uiReducer
