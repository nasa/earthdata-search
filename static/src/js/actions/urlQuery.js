import { urlReplaceInAction, UrlQueryParamTypes } from 'react-url-query'
import {
  CHANGE_KEYWORD_SEARCH,
  CHANGE_POINT_SEARCH,
  CHANGE_BOUNDING_BOX_SEARCH,
  CHANGE_POLYGON_SEARCH,
  CHANGE_MAP
} from '../constants/actionTypes'

export const changeKeywordSearch = urlReplaceInAction(CHANGE_KEYWORD_SEARCH, 'q', UrlQueryParamTypes.string)
export const changePointSearch = urlReplaceInAction(CHANGE_POINT_SEARCH, 'sp', UrlQueryParamTypes.string)
export const changeBoundingBoxSearch = urlReplaceInAction(CHANGE_BOUNDING_BOX_SEARCH, 'sb', UrlQueryParamTypes.string)
export const changePolygonSearch = urlReplaceInAction(CHANGE_POLYGON_SEARCH, 'polygon', UrlQueryParamTypes.string)
export const changeMap = urlReplaceInAction(CHANGE_MAP, 'm', UrlQueryParamTypes.string)
