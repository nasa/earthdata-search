import { getCollections } from './collections'
import { changeQuery, changeP } from './search'
import {
  changeKeywordSearch,
  changePointSearch,
  changeBoundingBoxSearch,
  changePolygonSearch,
  changeMap
} from './urlQuery'

const actions = {
  getCollections,
  changeQuery,
  changeP,
  changeMap,
  changeKeywordSearch,
  changePointSearch,
  changeBoundingBoxSearch,
  changePolygonSearch
}

export default actions
